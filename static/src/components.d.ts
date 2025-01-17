/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Note, Recipe, RecipeCompact, RecipeState, SearchFilter, SortBy, User } from "./generated";
export { Note, Recipe, RecipeCompact, RecipeState, SearchFilter, SortBy, User } from "./generated";
export namespace Components {
    interface AppRoot {
    }
    interface FiveStarRating {
        "disabled": boolean;
        "icon": string;
        "size": string;
        "value": number;
    }
    interface ImageUploadBrowser {
    }
    interface NoteEditor {
        "note": Note;
    }
    interface PageAdmin {
    }
    interface PageAdminConfiguration {
        "activatedCallback": () => Promise<void>;
    }
    interface PageAdminMaintenance {
    }
    interface PageAdminUsers {
        "activatedCallback": () => Promise<void>;
    }
    interface PageHome {
        "activatedCallback": () => Promise<void>;
    }
    interface PageLogin {
    }
    interface PageRecipe {
        "activatedCallback": () => Promise<void>;
        "recipeId": number;
    }
    interface PageSearch {
    }
    interface PageSettings {
    }
    interface PageSettingsPreferences {
        "activatedCallback": () => Promise<void>;
    }
    interface PageSettingsSearches {
        "activatedCallback": () => Promise<void>;
    }
    interface PageSettingsSecurity {
        "activatedCallback": () => Promise<void>;
    }
    interface RecipeCard {
        "recipe": RecipeCompact;
        "size": 'large' | 'small';
    }
    interface RecipeEditor {
        "recipe": Recipe;
    }
    interface RecipeLinkEditor {
        "parentRecipeId": number;
    }
    interface RecipeStateSelector {
        "selectedStates": RecipeState[];
    }
    interface SearchFilterEditor {
        "name": string;
        "prompt": string;
        "saveLabel": string;
        "searchFilter": SearchFilter;
        "showName": boolean;
        "showSavedLoader": boolean;
    }
    interface SortBySelector {
        "sortBy": SortBy;
    }
    interface TagsInput {
        "label": string;
        "suggestions": string[];
        "value": string[];
    }
    interface UserEditor {
        "user": User;
    }
}
export interface FiveStarRatingCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLFiveStarRatingElement;
}
export interface RecipeStateSelectorCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLRecipeStateSelectorElement;
}
export interface SortBySelectorCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLSortBySelectorElement;
}
export interface TagsInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLTagsInputElement;
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLFiveStarRatingElement extends Components.FiveStarRating, HTMLStencilElement {
    }
    var HTMLFiveStarRatingElement: {
        prototype: HTMLFiveStarRatingElement;
        new (): HTMLFiveStarRatingElement;
    };
    interface HTMLImageUploadBrowserElement extends Components.ImageUploadBrowser, HTMLStencilElement {
    }
    var HTMLImageUploadBrowserElement: {
        prototype: HTMLImageUploadBrowserElement;
        new (): HTMLImageUploadBrowserElement;
    };
    interface HTMLNoteEditorElement extends Components.NoteEditor, HTMLStencilElement {
    }
    var HTMLNoteEditorElement: {
        prototype: HTMLNoteEditorElement;
        new (): HTMLNoteEditorElement;
    };
    interface HTMLPageAdminElement extends Components.PageAdmin, HTMLStencilElement {
    }
    var HTMLPageAdminElement: {
        prototype: HTMLPageAdminElement;
        new (): HTMLPageAdminElement;
    };
    interface HTMLPageAdminConfigurationElement extends Components.PageAdminConfiguration, HTMLStencilElement {
    }
    var HTMLPageAdminConfigurationElement: {
        prototype: HTMLPageAdminConfigurationElement;
        new (): HTMLPageAdminConfigurationElement;
    };
    interface HTMLPageAdminMaintenanceElement extends Components.PageAdminMaintenance, HTMLStencilElement {
    }
    var HTMLPageAdminMaintenanceElement: {
        prototype: HTMLPageAdminMaintenanceElement;
        new (): HTMLPageAdminMaintenanceElement;
    };
    interface HTMLPageAdminUsersElement extends Components.PageAdminUsers, HTMLStencilElement {
    }
    var HTMLPageAdminUsersElement: {
        prototype: HTMLPageAdminUsersElement;
        new (): HTMLPageAdminUsersElement;
    };
    interface HTMLPageHomeElement extends Components.PageHome, HTMLStencilElement {
    }
    var HTMLPageHomeElement: {
        prototype: HTMLPageHomeElement;
        new (): HTMLPageHomeElement;
    };
    interface HTMLPageLoginElement extends Components.PageLogin, HTMLStencilElement {
    }
    var HTMLPageLoginElement: {
        prototype: HTMLPageLoginElement;
        new (): HTMLPageLoginElement;
    };
    interface HTMLPageRecipeElement extends Components.PageRecipe, HTMLStencilElement {
    }
    var HTMLPageRecipeElement: {
        prototype: HTMLPageRecipeElement;
        new (): HTMLPageRecipeElement;
    };
    interface HTMLPageSearchElement extends Components.PageSearch, HTMLStencilElement {
    }
    var HTMLPageSearchElement: {
        prototype: HTMLPageSearchElement;
        new (): HTMLPageSearchElement;
    };
    interface HTMLPageSettingsElement extends Components.PageSettings, HTMLStencilElement {
    }
    var HTMLPageSettingsElement: {
        prototype: HTMLPageSettingsElement;
        new (): HTMLPageSettingsElement;
    };
    interface HTMLPageSettingsPreferencesElement extends Components.PageSettingsPreferences, HTMLStencilElement {
    }
    var HTMLPageSettingsPreferencesElement: {
        prototype: HTMLPageSettingsPreferencesElement;
        new (): HTMLPageSettingsPreferencesElement;
    };
    interface HTMLPageSettingsSearchesElement extends Components.PageSettingsSearches, HTMLStencilElement {
    }
    var HTMLPageSettingsSearchesElement: {
        prototype: HTMLPageSettingsSearchesElement;
        new (): HTMLPageSettingsSearchesElement;
    };
    interface HTMLPageSettingsSecurityElement extends Components.PageSettingsSecurity, HTMLStencilElement {
    }
    var HTMLPageSettingsSecurityElement: {
        prototype: HTMLPageSettingsSecurityElement;
        new (): HTMLPageSettingsSecurityElement;
    };
    interface HTMLRecipeCardElement extends Components.RecipeCard, HTMLStencilElement {
    }
    var HTMLRecipeCardElement: {
        prototype: HTMLRecipeCardElement;
        new (): HTMLRecipeCardElement;
    };
    interface HTMLRecipeEditorElement extends Components.RecipeEditor, HTMLStencilElement {
    }
    var HTMLRecipeEditorElement: {
        prototype: HTMLRecipeEditorElement;
        new (): HTMLRecipeEditorElement;
    };
    interface HTMLRecipeLinkEditorElement extends Components.RecipeLinkEditor, HTMLStencilElement {
    }
    var HTMLRecipeLinkEditorElement: {
        prototype: HTMLRecipeLinkEditorElement;
        new (): HTMLRecipeLinkEditorElement;
    };
    interface HTMLRecipeStateSelectorElement extends Components.RecipeStateSelector, HTMLStencilElement {
    }
    var HTMLRecipeStateSelectorElement: {
        prototype: HTMLRecipeStateSelectorElement;
        new (): HTMLRecipeStateSelectorElement;
    };
    interface HTMLSearchFilterEditorElement extends Components.SearchFilterEditor, HTMLStencilElement {
    }
    var HTMLSearchFilterEditorElement: {
        prototype: HTMLSearchFilterEditorElement;
        new (): HTMLSearchFilterEditorElement;
    };
    interface HTMLSortBySelectorElement extends Components.SortBySelector, HTMLStencilElement {
    }
    var HTMLSortBySelectorElement: {
        prototype: HTMLSortBySelectorElement;
        new (): HTMLSortBySelectorElement;
    };
    interface HTMLTagsInputElement extends Components.TagsInput, HTMLStencilElement {
    }
    var HTMLTagsInputElement: {
        prototype: HTMLTagsInputElement;
        new (): HTMLTagsInputElement;
    };
    interface HTMLUserEditorElement extends Components.UserEditor, HTMLStencilElement {
    }
    var HTMLUserEditorElement: {
        prototype: HTMLUserEditorElement;
        new (): HTMLUserEditorElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "five-star-rating": HTMLFiveStarRatingElement;
        "image-upload-browser": HTMLImageUploadBrowserElement;
        "note-editor": HTMLNoteEditorElement;
        "page-admin": HTMLPageAdminElement;
        "page-admin-configuration": HTMLPageAdminConfigurationElement;
        "page-admin-maintenance": HTMLPageAdminMaintenanceElement;
        "page-admin-users": HTMLPageAdminUsersElement;
        "page-home": HTMLPageHomeElement;
        "page-login": HTMLPageLoginElement;
        "page-recipe": HTMLPageRecipeElement;
        "page-search": HTMLPageSearchElement;
        "page-settings": HTMLPageSettingsElement;
        "page-settings-preferences": HTMLPageSettingsPreferencesElement;
        "page-settings-searches": HTMLPageSettingsSearchesElement;
        "page-settings-security": HTMLPageSettingsSecurityElement;
        "recipe-card": HTMLRecipeCardElement;
        "recipe-editor": HTMLRecipeEditorElement;
        "recipe-link-editor": HTMLRecipeLinkEditorElement;
        "recipe-state-selector": HTMLRecipeStateSelectorElement;
        "search-filter-editor": HTMLSearchFilterEditorElement;
        "sort-by-selector": HTMLSortBySelectorElement;
        "tags-input": HTMLTagsInputElement;
        "user-editor": HTMLUserEditorElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface FiveStarRating {
        "disabled"?: boolean;
        "icon"?: string;
        "onValueSelected"?: (event: FiveStarRatingCustomEvent<number>) => void;
        "size"?: string;
        "value"?: number;
    }
    interface ImageUploadBrowser {
    }
    interface NoteEditor {
        "note"?: Note;
    }
    interface PageAdmin {
    }
    interface PageAdminConfiguration {
    }
    interface PageAdminMaintenance {
    }
    interface PageAdminUsers {
    }
    interface PageHome {
    }
    interface PageLogin {
    }
    interface PageRecipe {
        "recipeId"?: number;
    }
    interface PageSearch {
    }
    interface PageSettings {
    }
    interface PageSettingsPreferences {
    }
    interface PageSettingsSearches {
    }
    interface PageSettingsSecurity {
    }
    interface RecipeCard {
        "recipe"?: RecipeCompact;
        "size"?: 'large' | 'small';
    }
    interface RecipeEditor {
        "recipe"?: Recipe;
    }
    interface RecipeLinkEditor {
        "parentRecipeId"?: number;
    }
    interface RecipeStateSelector {
        "onSelectedStatesChanged"?: (event: RecipeStateSelectorCustomEvent<RecipeState[]>) => void;
        "selectedStates"?: RecipeState[];
    }
    interface SearchFilterEditor {
        "name"?: string;
        "prompt"?: string;
        "saveLabel"?: string;
        "searchFilter"?: SearchFilter;
        "showName"?: boolean;
        "showSavedLoader"?: boolean;
    }
    interface SortBySelector {
        "onSortByChanged"?: (event: SortBySelectorCustomEvent<SortBy>) => void;
        "sortBy"?: SortBy;
    }
    interface TagsInput {
        "label"?: string;
        "onValueChanged"?: (event: TagsInputCustomEvent<string[]>) => void;
        "suggestions"?: string[];
        "value"?: string[];
    }
    interface UserEditor {
        "user"?: User;
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "five-star-rating": FiveStarRating;
        "image-upload-browser": ImageUploadBrowser;
        "note-editor": NoteEditor;
        "page-admin": PageAdmin;
        "page-admin-configuration": PageAdminConfiguration;
        "page-admin-maintenance": PageAdminMaintenance;
        "page-admin-users": PageAdminUsers;
        "page-home": PageHome;
        "page-login": PageLogin;
        "page-recipe": PageRecipe;
        "page-search": PageSearch;
        "page-settings": PageSettings;
        "page-settings-preferences": PageSettingsPreferences;
        "page-settings-searches": PageSettingsSearches;
        "page-settings-security": PageSettingsSecurity;
        "recipe-card": RecipeCard;
        "recipe-editor": RecipeEditor;
        "recipe-link-editor": RecipeLinkEditor;
        "recipe-state-selector": RecipeStateSelector;
        "search-filter-editor": SearchFilterEditor;
        "sort-by-selector": SortBySelector;
        "tags-input": TagsInput;
        "user-editor": UserEditor;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "five-star-rating": LocalJSX.FiveStarRating & JSXBase.HTMLAttributes<HTMLFiveStarRatingElement>;
            "image-upload-browser": LocalJSX.ImageUploadBrowser & JSXBase.HTMLAttributes<HTMLImageUploadBrowserElement>;
            "note-editor": LocalJSX.NoteEditor & JSXBase.HTMLAttributes<HTMLNoteEditorElement>;
            "page-admin": LocalJSX.PageAdmin & JSXBase.HTMLAttributes<HTMLPageAdminElement>;
            "page-admin-configuration": LocalJSX.PageAdminConfiguration & JSXBase.HTMLAttributes<HTMLPageAdminConfigurationElement>;
            "page-admin-maintenance": LocalJSX.PageAdminMaintenance & JSXBase.HTMLAttributes<HTMLPageAdminMaintenanceElement>;
            "page-admin-users": LocalJSX.PageAdminUsers & JSXBase.HTMLAttributes<HTMLPageAdminUsersElement>;
            "page-home": LocalJSX.PageHome & JSXBase.HTMLAttributes<HTMLPageHomeElement>;
            "page-login": LocalJSX.PageLogin & JSXBase.HTMLAttributes<HTMLPageLoginElement>;
            "page-recipe": LocalJSX.PageRecipe & JSXBase.HTMLAttributes<HTMLPageRecipeElement>;
            "page-search": LocalJSX.PageSearch & JSXBase.HTMLAttributes<HTMLPageSearchElement>;
            "page-settings": LocalJSX.PageSettings & JSXBase.HTMLAttributes<HTMLPageSettingsElement>;
            "page-settings-preferences": LocalJSX.PageSettingsPreferences & JSXBase.HTMLAttributes<HTMLPageSettingsPreferencesElement>;
            "page-settings-searches": LocalJSX.PageSettingsSearches & JSXBase.HTMLAttributes<HTMLPageSettingsSearchesElement>;
            "page-settings-security": LocalJSX.PageSettingsSecurity & JSXBase.HTMLAttributes<HTMLPageSettingsSecurityElement>;
            "recipe-card": LocalJSX.RecipeCard & JSXBase.HTMLAttributes<HTMLRecipeCardElement>;
            "recipe-editor": LocalJSX.RecipeEditor & JSXBase.HTMLAttributes<HTMLRecipeEditorElement>;
            "recipe-link-editor": LocalJSX.RecipeLinkEditor & JSXBase.HTMLAttributes<HTMLRecipeLinkEditorElement>;
            "recipe-state-selector": LocalJSX.RecipeStateSelector & JSXBase.HTMLAttributes<HTMLRecipeStateSelectorElement>;
            "search-filter-editor": LocalJSX.SearchFilterEditor & JSXBase.HTMLAttributes<HTMLSearchFilterEditorElement>;
            "sort-by-selector": LocalJSX.SortBySelector & JSXBase.HTMLAttributes<HTMLSortBySelectorElement>;
            "tags-input": LocalJSX.TagsInput & JSXBase.HTMLAttributes<HTMLTagsInputElement>;
            "user-editor": LocalJSX.UserEditor & JSXBase.HTMLAttributes<HTMLUserEditorElement>;
        }
    }
}
