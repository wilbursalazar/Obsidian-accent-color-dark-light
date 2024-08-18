"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const DEFAULT_SETTINGS = {
    lightAccent: '#ff0000', // Default light theme accent color
    darkAccent: '#0000ff', // Default dark theme accent color
};
class AccentColorPlugin extends obsidian_1.Plugin {
    // Initialize the settings property in the constructor
    constructor(app, manifest) {
        super(app, manifest);
        this.settings = DEFAULT_SETTINGS;
    }
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Loading Accent Color Plugin');
            // Load settings from disk or use defaults
            yield this.loadSettings();
            // Add the settings tab to the Obsidian settings
            this.addSettingTab(new AccentColorSettingTab(this.app, this));
            // Apply the accent color based on the current theme
            this.updateAccentColor();
            // Reapply the accent color if the theme changes
            this.registerEvent(this.app.workspace.on('css-change', () => this.updateAccentColor()));
        });
    }
    onunload() {
        console.log('Unloading Accent Color Plugin');
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
            this.updateAccentColor();
        });
    }
    updateAccentColor() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const accentColor = isDarkMode ? this.settings.darkAccent : this.settings.lightAccent;
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }
}
exports.default = AccentColorPlugin;
class AccentColorSettingTab extends obsidian_1.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Accent Color Settings' });
        new obsidian_1.Setting(containerEl)
            .setName('Light Theme Accent Color')
            .setDesc('Set the accent color for the light theme.')
            .addText(text => text
            .setPlaceholder('#ff0000')
            .setValue(this.plugin.settings.lightAccent)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.lightAccent = value;
            yield this.plugin.saveSettings();
        })));
        new obsidian_1.Setting(containerEl)
            .setName('Dark Theme Accent Color')
            .setDesc('Set the accent color for the dark theme.')
            .addText(text => text
            .setPlaceholder('#0000ff')
            .setValue(this.plugin.settings.darkAccent)
            .onChange((value) => __awaiter(this, void 0, void 0, function* () {
            this.plugin.settings.darkAccent = value;
            yield this.plugin.saveSettings();
        })));
    }
}
