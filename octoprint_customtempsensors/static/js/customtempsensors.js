/*
 * View model for OctoPrint-CustomTempSensors
 *
 * Author: Kestin Goforth
 * License: AGPLv3
 */
$(function () {
    function CustomTempSensorsViewModel(parameters) {
        var self = this;

        self.settingsView = parameters[0];

        self.sensors = ko.observable(false);
        self.anyHasTarget = ko.pureComputed(function () {
            for (let sensor of self.sensors()) {
                if (sensor.hasTarget()) return true;
            }
            return false;
        });
        self.formatTemperature = function (temp) {
            return temp;
        };

        self.onBeforeBinding = function () {
            self._settings = self.settingsView.settings.plugins.customtempsensors;
            self._updateSettings(self._settings, self);
        };

        self.onSettingsBeforeSave = function () {
            self._updateSettings(self, self._settings);
        };

        self._updateSettings = function (source, target) {
            target.sensors(source.sensors());
        };

        self.fromCurrentData = function (data) {
            if (data.temps && data.temps.length) {
                for (let sensor of self.sensors()) {
                    let temp = data.temps[0][sensor.id()];
                    sensor.actual(temp.actual);
                    sensor.target(temp.target);
                }
            }
        };
    }

    /* view model class, parameters for constructor, container to bind to
     * Please see http://docs.octoprint.org/en/master/plugins/viewmodels.html#registering-custom-viewmodels for more details
     * and a full list of the available options.
     */
    OCTOPRINT_VIEWMODELS.push({
        construct: CustomTempSensorsViewModel,
        dependencies: ["settingsViewModel"],
        elements: [
            "#settings_plugin_customtempsensors",
            "#sidebar_plugin_customtempsensors",
            "#tab_plugin_customtempsensors"
        ]
    });
});
