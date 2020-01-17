'use strict';
import { html } from '@polymer/polymer/polymer-element.js';
import {customElement, property } from '@polymer/decorators';
import { IronAjaxElement } from '@polymer/iron-ajax/iron-ajax.js';
import { GompBaseElement } from '../common/gomp-base-element.js';
import { ConfirmationDialog } from './confirmation-dialog.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/communication-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-item/paper-icon-item.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@cwmr/paper-divider/paper-divider.js';
import './confirmation-dialog.js';
import '../shared-styles.js';

@customElement('note-card')
export class NoteCard extends GompBaseElement {
    static get template() {
        return html`
            <style include="shared-styles">
                :host {
                    display: block;
                    color: var(--primary-text-color);

                    --paper-card: {
                        width: 100%;
                    }
                }
                paper-card:hover {
                    @apply --shadow-elevation-6dp;
                }
                .note-header {
                    margin-bottom: 0.5em;
                }
                .note-content {
                    margin: 0.75em;
                    white-space: pre-wrap;
                }
                .note-footer {
                    margin-top: 0.5em;
                }
                #modified-date {
                    @apply --layout-horizontal;
                    @apply --layout-end-justified;
                }
                .date {
                    color: var(--secondary-text-color);
                    font-size: 0.8em;
                    font-weight: lighter;
                }
                paper-menu-button {
                    posion: absolute;
                    top: 0;
                    right: 0;
                }
                .amber {
                    color: var(--paper-amber-500);
                }
                .red {
                    color: var(--paper-red-500);
                }
                #confirmDeleteDialog {
                    --confirmation-dialog-title-color: var(--paper-red-500);
                }
                paper-icon-item {
                    cursor: pointer;
                }
            </style>

            <paper-card>
                <div class="card-content">
                    <div class="note-header">
                        <iron-icon icon="communication:comment"></iron-icon>
                        <span class="date">[[formatDate(note.createdAt)]]</span>
                        <paper-menu-button id="noteMenu" horizontal-align="right">
                            <paper-icon-button icon="icons:more-vert" slot="dropdown-trigger"></paper-icon-button>
                            <paper-listbox slot="dropdown-content">
                                <a href="#!" tabindex="-1" on-click="onEditClicked">
                                    <paper-icon-item tabindex="-1"><iron-icon class="amber" icon="icons:create" slot="item-icon"></iron-icon> Edit</paper-icon-item>
                                </a>
                                <a href="#!" tabindex="-1" on-click="onDeleteClicked">
                                    <paper-icon-item tabindex="-1"><iron-icon class="red" icon="icons:delete" slot="item-icon"></iron-icon> Delete</paper-icon-item>
                                </a>
                            </paper-listbox>
                        </paper-menu-button>
                    </div>
                    <paper-divider></paper-divider>
                    <p class="note-content">[[note.text]]</p>
                    <paper-divider hidden\$="[[!showModifiedDate(note)]]"></paper-divider>
                    <div id="modified-date" class="note-footer" hidden\$="[[!showModifiedDate(note)]]">
                        <span class="date">[[formatDate(note.modifiedAt)]]</span>
                    </div>
                </div>
            </paper-card>

            <confirmation-dialog id="confirmDeleteDialog" icon="delete" title="Delete Note?" message="Are you sure you want to delete this note?" on-confirmed="deleteNote"></confirmation-dialog>

            <iron-ajax bubbles="" id="deleteAjax" url="/api/v1/notes/[[note.id]]" method="DELETE" on-response="handleDeleteResponse" on-error="handleDeleteError"></iron-ajax>
`;
    }

    @property({type: Object, notify: true})
    public note: object|null = null;

    private get confirmDeleteDialog(): ConfirmationDialog {
        return this.$.confirmDeleteDialog as ConfirmationDialog;
    }
    private get deleteAjax(): IronAjaxElement {
        return this.$.deleteAjax as IronAjaxElement;
    }

    protected onEditClicked(e: any) {
        // Don't navigate to "#!"
        e.preventDefault();

        e.target.closest('#noteMenu').close();
        this.dispatchEvent(new CustomEvent('note-card-edit'));
    }
    protected onDeleteClicked(e: any) {
        // Don't navigate to "#!"
        e.preventDefault();

        e.target.closest('#noteMenu').close();
        this.confirmDeleteDialog.open();
    }
    protected deleteNote() {
        this.deleteAjax.generateRequest();
    }

    protected formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleString();
    }
    protected showModifiedDate(note: any) {
        return note.modifiedAt !== note.createdAt;
    }

    protected handleDeleteResponse() {
        this.dispatchEvent(new CustomEvent('note-card-deleted'));
        this.showToast('Note deleted.');
    }
    protected handleDeleteError() {
        this.showToast('Deleting note failed!');
    }
}