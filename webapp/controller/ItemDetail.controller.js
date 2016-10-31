sap.ui.define([
	"so/display/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(BaseController, JSONModel, Device) {
	"use strict";

	return BaseController.extend("so.display.controller.ItemDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf so.display.view.view.ItemDetail
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				edit: false,
				display: true,
				itemCount: 0
			});
			this.getRouter().getRoute("item").attachPatternMatched(this._onObjectMatched, this);
			this.setModel(oViewModel, "itemDetailView");
			this.getOwnerComponent().oWhenMetadataIsLoaded.then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */
		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			var sObjectId = oEvent.getParameter("arguments").SOID;
			var sItemId = oEvent.getParameter("arguments").ItemID;
			this.getOwnerComponent().oWhenMetadataIsLoaded.then(function() {
				var sObjectPath = this.getModel().createKey("SoItemDataSet", {
					Vbeln: sObjectId,
					Posnr: sItemId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function(sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("itemDetailView");
			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);
			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				return;
			}
		},

		_onMetadataLoaded: function() {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("itemDetailView");
			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},

		onSaveEdit: function() {

			var oView = this.getView(),
				oElementBinding = oView.getElementBinding(),
				oModel = this.getModel(),
				sPath = oElementBinding.getPath();
			if (oElementBinding.getBoundContext()) {
				var oItem = oModel.getProperty(sPath);
				oModel.update(sPath, oItem);
				return;
			}
			// var iCount = this.getModel("detailView").getProperty("/itemCount");
			// for (var i = 0; i < iCount; i++) {
			// 	var sPath = aItemList[i].getBindingContext().sPath;
			// 	var oModel = this.getModel();
			// 	var oItem = oModel.getProperty(sPath);
			// 	oModel.update(sPath, oItem);
			// }
		},

		resetChange: function() {
			this.getModel().resetChanges();
		},

		onResetPress: function() {
			this.resetChange();
		}
	});

});