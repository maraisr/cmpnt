abstract class AComponent {
	abstract render():string;
}




@Component('s-test', {
	private: true,
	style: 'h1 {color: red}'
})
class MyComponent {
	fooBar: string = 'hello world';

	render() {
		return `<h1>${this.fooBar}</h1>`;
	}
}

interface IConfig {
	private?: boolean;
	style: string;
}

function Component(selector: string, config?: IConfig) {
	const defaultConfig = Object.assign(
		{},
		{
			private: false
		} as Partial<IConfig>,
		config
	);

	return (target: HTMLElement) => {
		window.customElements.define(
			selector,
			class extends target {
				constructor() {
					super();
					defaultConfig.private &&
						this.attachShadow({ mode: 'open' });

					const style = document.createElement('style');
					style.innerText = defaultConfig.style;
					this.shadowRoot.appendChild(style);

					this.__render();
				}

				private __render() {
					this.shadowRoot.innerHTML = this.render();
				}
			}
		);
	};
}