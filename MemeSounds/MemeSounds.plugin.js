/**
 * @name MemeSoundsV2
 * @version 0.6.1
 * @description Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out! OG Plugin by Lonk12!
 * @author PatoFlamejanteTV
 * @authorId 557388558017495046
 * @authorLink https://github.com/PatoFlamejanteTV
 * @source https://github.com/PatoFlamejanteTV/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js
 * @updateUrl https://raw.githubusercontent.com/PatoFlamejanteTV/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js
 */

module.exports = (() => {
	
	/* Configuração */
	const config = {info: {name: "Meme Sounds Fork", authors: [{name: "patoflamejantetv", discord_id: "1176152815027101787", github_username: "PatoFlamejanteTV"}], version: "0.6.1", description: "Plays Memetastic sounds depending on what is being sent in chat. This was heavily inspired by the idea of Metalloriff's bruh plugin so go check him out! Also, original plugin was made by Lork12!", github: "https://github.com/PatoFlamejanteTV/BetterDiscordPlugins/blob/main/MemeSounds/MemeSounds.plugin.js", github_raw: "https://raw.githubusercontent.com/PatoFlamejanteTV/BetterDiscordPlugins/main/MemeSounds/MemeSounds.plugin.js"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "category", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], changelog: [{title: "New Stuff", items: ["Added :skull: sound effects (plays an Lego SFX)", "Thanks to Orangenal name#9280 for adding vine boom!"]}]};

	/* Bagulho das biblioteca */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Audios que vão tocar */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /no?ice/gmi, file: "noice.mp3", duration: 600},
				{re: /bazinga/gmi, file: "bazinga.mp3", duration: 550},
				{re: /oof/gmi, file: "oof.mp3", duration: 250},
				{re: /bruh/gmi, file: "bruh.mp3", duration: 470},
				{re: /🗿/gmi, file: "moyai.mp3", duration: 100},
				{re: /💀/gmi, file: "skull.mp3", duration: 1000},
				{re: /☠️/gmi, file: "skull.mp3", duration: 1000},
				{re: /🇧🇷/gmi, file: "brazil.mp3", duration: 2850} /* HUEHUE BR */
			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/PatoFlamejanteTV/BetterDiscordPlugins/raw/main/MemeSounds/Sounds/"+sound[1].file); /* aqui, ele vai mandar um pedido pro github pra tentar achar o .mp3 do efeito sonoro */
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
