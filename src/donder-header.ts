/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  html,
  TemplateResult,
  css,
  PropertyValues,
  CSSResultGroup,
} from 'lit';
import { property, state } from "lit/decorators";
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers
import { CARD_VERSION } from './constants';
import './editor';

import type { BoilerplateCardConfig } from './types';
import { actionHandler } from './action-handler-directive';

/* eslint no-console: 0 */
console.info(
  `%c  donder-header \n%c  version: ${CARD_VERSION}  `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'donder-header',
  name: 'Donder Header',
  description: 'A template custom card for you to create something awesome',
});

export class BoilerplateCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    // REPLACE "donder-header" with widget name, everywhere in the project
    // REPLACE the file name with the actual widget name
    return document.createElement('donder-header-editor');
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: BoilerplateCardConfig;

  public setConfig(config: BoilerplateCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error('Invalid configuration');
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'Boilerplate',
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private _showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }

  static get styles(): CSSResultGroup {
    return css`
      /* REPLACE "donder-header" with actual widget name */
      .type-custom-donder-header {
        height: 100%;
        width: 100%;
      }
      .donder-widget {
        height: 100%;
        width: 100%;
        padding: 20px 20px 0px 20px;
        box-sizing: border-box;
        background-color: transparent;
        color: var(--text-primary-color);
        /* border-radius: var(--ha-card-border-radius) */
      }
      .donder-name {
        font-size: 28px;
        text-transform: uppercase;
        font-weight: 700;
      }
      .donder-name span {
        font-weight: 500;
        color: #49aae3;
        margin-left: 5px;
      }
      .donder-address {
        text-transform: uppercase;
        font-weight: 600;
        font-size: 0.7em;
        line-height: 1.1em;
        margin-top: 8px;
      }
      @media (max-width: 600px) {
        .donder-widget {
          padding-left: 0px;
          font-size: 0.8em;
        }
        .donder-name {
          font-size: 24px;
        }
      }
    `;
  }

  protected render(): TemplateResult | void {
    if (this.config.show_warning) {
      return this._showWarning('warning message');
    }

    if (this.config.show_error) {
      return this._showError('error message');
    }

    const env = this.hass.states['donder_env.global'].attributes

    return html`
      <ha-card>
        <div class='donder-widget'>
          <div class="donder-name">D O N D E R <span>A I</span></div>
          <div class="donder-address">
            <div class="donder-address-text">${env?.address}</div>
            <div class="donder-status">v${env?.version}</div>
          </div>
        </div>
      </ha-card>
    `;
  }
}

customElements.define("donder-header", BoilerplateCard);
