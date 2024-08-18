import { Plugin, PluginSettingTab, Setting, App } from 'obsidian';

interface MyPluginSettings {
    lightAccent: string;
    darkAccent: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    lightAccent: '#ff0000', // Default light theme accent color
    darkAccent: '#0000ff',  // Default dark theme accent color
}

export default class AccentColorPlugin extends Plugin {
    settings: MyPluginSettings;

    // Initialize the settings property in the constructor
    constructor(app: App, manifest: any) {
        super(app, manifest);
        this.settings = DEFAULT_SETTINGS;
    }

    async onload() {
        console.log('Loading Accent Color Plugin');

        // Load settings from disk or use defaults
        await this.loadSettings();

        // Add the settings tab to the Obsidian settings
        this.addSettingTab(new AccentColorSettingTab(this.app, this));

        // Apply the accent color based on the current theme
        this.updateAccentColor();

        // Reapply the accent color if the theme changes
        this.registerEvent(this.app.workspace.on('css-change', () => this.updateAccentColor()));
    }

    onunload() {
        console.log('Unloading Accent Color Plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.updateAccentColor();
    }

    updateAccentColor() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const accentColor = isDarkMode ? this.settings.darkAccent : this.settings.lightAccent;

        document.documentElement.style.setProperty('--accent-color', accentColor);
    }
}

class AccentColorSettingTab extends PluginSettingTab {
    plugin: AccentColorPlugin;

    constructor(app: App, plugin: AccentColorPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Accent Color Settings' });

        new Setting(containerEl)
            .setName('Light Theme Accent Color')
            .setDesc('Set the accent color for the light theme.')
            .addText(text => text
                .setPlaceholder('#ff0000')
                .setValue(this.plugin.settings.lightAccent)
                .onChange(async (value) => {
                    this.plugin.settings.lightAccent = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Dark Theme Accent Color')
            .setDesc('Set the accent color for the dark theme.')
            .addText(text => text
                .setPlaceholder('#0000ff')
                .setValue(this.plugin.settings.darkAccent)
                .onChange(async (value) => {
                    this.plugin.settings.darkAccent = value;
                    await this.plugin.saveSettings();
                }));
    }
}
