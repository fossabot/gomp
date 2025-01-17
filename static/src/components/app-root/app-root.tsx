import axios from 'axios';
import { actionSheetController, alertController, modalController, pickerController, popoverController } from '@ionic/core';
import { Component, Element, h, Listen, State } from '@stencil/core';
import { AccessLevel, SearchFilter } from '../../generated';
import { appApi } from '../../helpers/api';
import { redirect, enableBackForOverlay, sendDeactivatingCallback, sendActivatedCallback, hasScope } from '../../helpers/utils';
import { getDefaultSearchFilter } from '../../models';
import appConfig from '../../stores/config';
import state, { clearState, refreshSearchResults } from '../../stores/state';
import { NavigationHookResult } from '@ionic/core/dist/types/components/route/route-interface';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() loadingCount = 0;

  @Element() el!: HTMLAppRootElement;
  private tabs!: HTMLIonTabsElement;
  private menu!: HTMLIonMenuElement;
  private searchBar!: HTMLIonInputElement;
  private isRefreshingToken = false;

  async componentWillLoad() {
    axios.interceptors.request.use(config => {
      this.loadingCount++;

      return config;
    }, error => {
      if (this.loadingCount > 0) {
        this.loadingCount--;
      }

      return error;
    });
    axios.interceptors.response.use(resp => {
      if (this.loadingCount > 0) {
        this.loadingCount--;
      }

      return resp;
    }, async error => {
      if (this.loadingCount > 0) {
        this.loadingCount--;
      }
      if (error.response?.status === 401) {
        await this.logout();
      } else if (error.response?.status === 403 && !this.isRefreshingToken) {
        // Try refreshing the token and repeating the request
        // This can fix the situation where the access level of
        // the user has been changed and requires a new token
        this.isRefreshingToken = true;
        try {
          const { data } = await appApi.refreshToken();
          state.jwtToken = data.token;
          const resp = await axios.request(error.config);
          return resp;
        } catch(retryError) {
          // Just log this; let the original error propogate
          console.error(retryError);
        } finally {
          this.isRefreshingToken = false;
        }
      }

      return Promise.reject(error);
    });

    await this.loadAppConfiguration();
  }

  render() {
    return (
      <ion-app>
        <ion-router useHash={false} onIonRouteWillChange={() => this.onPageChanging()} onIonRouteDidChange={() => this.onPageChanged()}>
          <ion-route url="/login" component="tab-login" />

          <ion-route url="/" component="tab-home" beforeEnter={() => this.requireLogin()} />

          <ion-route url="/search" component="tab-search" beforeEnter={() => this.requireLogin()} />

          <ion-route url="/recipes" component="tab-recipe" beforeEnter={() => this.requireLogin()}>
            <ion-route url="/:recipeId" component="page-recipe" />
          </ion-route>

          <ion-route url="/settings" component="tab-settings">
            <ion-route component="page-settings">
              <ion-route component="tab-settings-preferences" beforeEnter={() => this.requireLogin()} />
              <ion-route url="/preferences" component="tab-settings-preferences" />
              <ion-route url="/searches" component="tab-settings-searches" />
              <ion-route url="/security" component="tab-settings-security" />
            </ion-route>
          </ion-route>

          <ion-route url="/admin" component="tab-admin">
            <ion-route component="page-admin">
              <ion-route component="tab-admin-configuration" beforeEnter={() => this.requireAdmin()} />
              <ion-route url="/configuration" component="tab-admin-configuration" />
              <ion-route url="/users" component="tab-admin-users" />
              <ion-route url="/maintenance" component="tab-admin-maintenance" />
            </ion-route>
          </ion-route>
        </ion-router>

        <ion-menu side="start" content-id="main-content" ref={el => this.menu = el}>
          <ion-content>
            <ion-list>
              <ion-item href="/" lines="none">
                <ion-icon name="home" slot="start" />
                <ion-label>Home</ion-label>
              </ion-item>
              <ion-item href="/search" lines="full">
                <ion-icon name="restaurant" slot="start" />
                <ion-label>Recipes</ion-label>
                <ion-badge slot="end" color="secondary">{state.searchResultCount}</ion-badge>
              </ion-item>
              <ion-item href="/settings" lines="full">
                <ion-icon name="settings" slot="start" />
                <ion-label>Settings</ion-label>
              </ion-item>
              {hasScope(state.jwtToken, AccessLevel.Admin) ?
                <ion-item href="/admin" lines="full">
                  <ion-icon name="shield-checkmark" slot="start" />
                  <ion-label>Admin</ion-label>
                </ion-item>
                : ''}
              <ion-item lines="none" button onClick={() => this.logout()}>
                <ion-icon name="log-out" slot="start" />
                <ion-label>Logout</ion-label>
              </ion-item>
            </ion-list>
          </ion-content>

          <ion-footer color="medium" class="ion-text-center ion-padding">
            <div class="copyright">GOMP: Go Meal Plannner {appConfig.info.version}. Copyright © 2016-2022 Chad Weimer</div>
          </ion-footer>
        </ion-menu>

        <div class="ion-page" id="main-content">
          <ion-header mode="md">
            <ion-toolbar color="primary">
              {hasScope(state.jwtToken, AccessLevel.Viewer) ?
                <ion-buttons slot="start">
                  <ion-menu-button class="ion-hide-lg-up" />
                </ion-buttons>
                : ''}

              <ion-title slot="start" class={{ ['ion-hide-sm-down']: hasScope(state.jwtToken, AccessLevel.Viewer) }}>
                <ion-router-link href="/" class="contrast">{appConfig.config.title}</ion-router-link>
              </ion-title>

              {hasScope(state.jwtToken, AccessLevel.Viewer) ? [
                <ion-buttons slot="end">
                  <ion-button href="/" class="ion-hide-lg-down">Home</ion-button>
                  <ion-button href="/search" class="ion-hide-lg-down">
                    Recipes
                    <ion-badge slot="end" color="secondary">{state.searchResultCount}</ion-badge>
                  </ion-button>
                  <ion-button href="/settings" class="ion-hide-lg-down">Settings</ion-button>
                  {hasScope(state.jwtToken, AccessLevel.Admin) ?
                    <ion-button href="/admin" class="ion-hide-lg-down">Admin</ion-button>
                    : ''}
                  <ion-button class="ion-hide-lg-down" onClick={() => this.logout()}>Logout</ion-button>
                </ion-buttons>,
                <ion-item slot="end" lines="none" class="search">
                  <ion-icon icon="search" slot="start" />
                  <ion-input type="search" placeholder="Search" value={state.searchFilter?.query}
                    onKeyDown={e => this.onSearchKeyDown(e)}
                    onIonBlur={() => this.searchBar.value = state.searchFilter?.query ?? ''}
                    ref={el => this.searchBar = el} />
                  <ion-buttons slot="end" class="ion-no-margin">
                    <ion-button color="medium" onClick={() => this.onSearchClearClicked()}><ion-icon icon="close" slot="icon-only" /></ion-button>
                    <ion-button color="medium" onClick={() => this.onSearchFilterClicked()}><ion-icon icon="options" slot="icon-only" /></ion-button>
                  </ion-buttons>
                </ion-item>
              ] : ''}
            </ion-toolbar>
            {this.loadingCount > 0 ?
              <ion-progress-bar type="indeterminate" color="secondary" />
              :
              <ion-progress-bar value={100} color="primary" />
            }
          </ion-header>

          <ion-content>
            <ion-tabs ref={el => this.tabs = el}>
              <ion-tab tab="tab-login" component="page-login" />
              <ion-tab tab="tab-home" component="page-home" />
              <ion-tab tab="tab-search" component="page-search" />
              <ion-tab tab="tab-recipe">
                <ion-nav animated={false} />
              </ion-tab>
              <ion-tab tab="tab-settings">
                <ion-nav animated={false} />
              </ion-tab>
              <ion-tab tab="tab-admin">
                <ion-nav animated={false} />
              </ion-tab>
            </ion-tabs>
          </ion-content>
        </div>
      </ion-app>
    );
  }

  @Listen('popstate', { target: 'window' })
  async onWindowPopState() {
    await this.closeAllOverlays();
  }

  private async loadAppConfiguration() {
    try {
      ({ data: appConfig.info } = await appApi.getInfo());
      ({ data: appConfig.config } = await appApi.getConfiguration());

      document.title = appConfig.config.title;
      const appName = document.querySelector('meta[name="application-name"]');
      if (appName) {
        appName.setAttribute('content', document.title);
      }
      const appTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if (appTitle) {
        appTitle.setAttribute('content', document.title);
      }
    } catch (ex) {
      console.error(ex);
    }
  }

  private async logout() {
    clearState();
    await redirect('/login');
  }

  private isLoggedIn() {
    return !!state.jwtToken;
  }

  private requireLogin(): NavigationHookResult {
    if (this.isLoggedIn()) {
      return true;
    }

    return { redirect: '/login' };
  }

  private requireAdmin(): NavigationHookResult {
    if (hasScope(state.jwtToken, AccessLevel.Admin)) {
      return true;
    }

    return { redirect: '/' };
  }

  private async closeAllOverlays() {
    // Close any and all modals
    const controllers = [
      actionSheetController,
      alertController,
      modalController,
      pickerController,
      popoverController
    ];
    for (const controller of controllers) {
      try {
        await controller.dismiss();
      } catch {
        // Nothing to do here. There might not have been something open
      }
    }
  }

  private async onPageChanging() {
    this.menu.close();
    // Let the current page know it's being deactivated
    await sendDeactivatingCallback(this.tabs);
  }

  private async onPageChanged() {
    if (this.isLoggedIn()) {
      // Make sure there are search results on initial load
      if (state.searchResults === undefined) {
        await refreshSearchResults();
      }
    }

    // Let the new page know it's been activated
    await sendActivatedCallback(this.tabs);

    await this.closeAllOverlays();
  }

  private async onSearchKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      state.searchFilter = {
        ...state.searchFilter,
        query: this.searchBar.value?.toString()
      };
      await redirect('/search');
    }
  }

  private async onSearchClearClicked() {
    state.searchFilter = getDefaultSearchFilter();
    await redirect('/search');
  }

  private async onSearchFilterClicked() {
    await enableBackForOverlay(async () => {
      const modal = await modalController.create({
        component: 'search-filter-editor',
        componentProps: {
          saveLabel: 'Search',
          prompt: 'Search',
          showName: false,
          showSavedLoader: true,
          searchFilter: state.searchFilter
        },
        animated: false,
        backdropDismiss: false,
      });
      await modal.present();

      const { data } = await modal.onDidDismiss<{ searchFilter: SearchFilter }>();
      if (data) {
        state.searchFilter = data.searchFilter;
        await redirect('/search');
      }
    });
  }
}
