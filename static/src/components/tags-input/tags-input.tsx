import { Component, Event, Host, h, Prop, State, EventEmitter, Watch } from '@stencil/core';

@Component({
  tag: 'tags-input',
  styleUrl: 'tags-input.css',
})
export class TagsInput {
  @Prop() label = 'Tags';
  @Prop() value: string[] = [];
  @Prop() suggestions: string[] = [];

  @Event() valueChanged: EventEmitter<string[]>;

  @State() internalValue: string[] = [];
  @State() filteredSuggestions: string[] = [];

  private tagsInput!: HTMLIonInputElement;

  @Watch('value')
  onValueChanged(newValue: string[]) {
    this.internalValue = newValue ?? [];
    this.filterSuggestedTags(this.suggestions);
  }

  @Watch('suggestions')
  onSuggestionsChanged(newValue: string[]) {
    this.filterSuggestedTags(newValue);
  }

  connectedCallback() {
    this.internalValue = this.value ?? [];
    this.filterSuggestedTags(this.suggestions);
  }

  render() {
    return (
      <Host>
        <ion-item>
          <ion-label position="stacked">{this.label}</ion-label>
          {this.internalValue?.length > 0 ?
            <div class="ion-padding-top">
              {this.internalValue?.map(tag =>
                <ion-chip onClick={() => this.removeTag(tag)}>
                  {tag}
                  <ion-icon icon="close-circle" />
                </ion-chip>
              )}
            </div>
            : ''}
          <ion-input enterkeyhint="enter" onKeyDown={e => this.onTagsKeyDown(e)} ref={el => this.tagsInput = el} />
        </ion-item>
        <div class="ion-padding">
          {this.filteredSuggestions?.map(tag =>
            <ion-chip color="success" onClick={() => this.addTag(tag)}>
              {tag}
              <ion-icon icon="add-circle" />
            </ion-chip>
          )}
        </div>
      </Host>
    );
  }

  private filterSuggestedTags(suggestions: string[]) {
    this.filteredSuggestions =
      suggestions?.filter(value => !this.internalValue.includes(value) ?? true)
      ?? [];
  }

  private addTag(tag: string) {
    this.internalValue = [
      ...this.internalValue,
      tag.toLowerCase()
    ].filter((value, index, self) => self.indexOf(value) === index);
    this.filterSuggestedTags(this.suggestions);
    this.valueChanged.emit(this.internalValue);
  }

  private removeTag(tag: string) {
    this.internalValue = this.internalValue.filter(value => value !== tag);
    this.filterSuggestedTags(this.suggestions);
    this.valueChanged.emit(this.internalValue);
  }

  private onTagsKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && this.tagsInput.value) {
      this.addTag(this.tagsInput.value.toString());
      this.tagsInput.value = '';
    }
  }

}
