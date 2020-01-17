'use strict';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { property } from '@polymer/decorators';

export abstract class GompBaseElement extends PolymerElement {
    @property({type: Boolean, notify: true})
    protected isReady = false;
    @property({type: Boolean, notify: true, reflectToAttribute: true, observer: 'isActiveChanged'})
    protected isActive = false;

    public ready() {
        super.ready();

        this.isReady = true;
    }

    protected showToast(message: string) {
        this.dispatchEvent(new CustomEvent('show-toast', {bubbles: true, composed: true, detail: {message}}));
    }

    // tslint:disable-next-line:no-empty
    protected isActiveChanged(_: boolean) {}
}