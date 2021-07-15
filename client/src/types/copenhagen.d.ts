declare namespace Copenhagen {
	function initSelectorAll(selector: string): Editor[];

	declare class Editor {
		constructor(options: { language: 'javascript' });

		addHotkey(key: string, fn: () => void);

		disable();

		enable();

		focus(selectAll?: boolean);

		emulateUserAction(name: string);

		find(value: string);

		setValue(value: string);

		getValue();

		open(element: HTMLElement, focus?: boolean, replaceText?: boolean);

		on(event: 'save', fn: (editor: Editor, value: string) => void);
		on(event: 'change', fn: (editor: Editor, value: string) => void);
		on(event: 'metadata', fn: () => void);
	}
}
