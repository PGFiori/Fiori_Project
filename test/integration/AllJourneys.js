jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.Opa5");

jQuery.sap.require("test.test.integration.pages.Common");
jQuery.sap.require("test.test.integration.pages.App");
jQuery.sap.require("test.test.integration.pages.Browser");
jQuery.sap.require("test.test.integration.pages.Master");
jQuery.sap.require("test.test.integration.pages.Detail");
jQuery.sap.require("test.test.integration.pages.NotFound");

sap.ui.test.Opa5.extendConfig({
	arrangements: new test.test.integration.pages.Common(),
	viewNamespace: "test.view."
});

jQuery.sap.require("test.test.integration.MasterJourney");
jQuery.sap.require("test.test.integration.NavigationJourney");
jQuery.sap.require("test.test.integration.NotFoundJourney");
jQuery.sap.require("test.test.integration.BusyJourney");
jQuery.sap.require("test.test.integration.FLPIntegrationJourney");