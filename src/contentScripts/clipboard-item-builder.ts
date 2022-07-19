import * as clipboard from 'clipboard-polyfill';
import { Context } from './context';
import { getDelimiter } from '~/logic/storage';

export class ClipboardItemBuilder {
  static async build(
    context: String
  ): Promise<clipboard.ClipboardItemInterface> {
    if (context === Context.Overview) {
      return this.buildOverviewItem();
    }
    return this.buildDetailItem();
  }

  private static async buildOverviewItem(): Promise<clipboard.ClipboardItemInterface> {
    const url = this.getItemUrl(this.getOverviewItemId);
    const description = await this.getItemDescription(
      this.getOverviewItemId,
      this.getOverviewItemTitle
    );
    return this.buildClipboardItem(url, description);
  }

  private static async buildDetailItem(): Promise<clipboard.ClipboardItemInterface> {
    const url = this.getItemUrl(this.getOverviewItemId);
    const description = await this.getItemDescription(
      this.getDetailItemId,
      this.getDetailItemTitle
    );
    return this.buildClipboardItem(url, description);
  }

  private static getOverviewItemId(): string {
    const selectedItem = document.querySelector('.yui3-cardgrid-item-focus');
    const itemId =
      selectedItem?.querySelector("[data-column='id']")?.textContent;
    if (!itemId) {
      return '';
    }

    return itemId;
  }

  private static getOverviewItemTitle(): string {
    const selectedItem = document.querySelector('.yui3-cardgrid-item-focus');
    const itemTitle = selectedItem?.querySelector(
      "[data-column='name']"
    )?.textContent;
    return itemTitle || '';
  }

  private static getDetailItemId(): string {
    const itemId = document.querySelector('.item-field-id')?.textContent;
    return itemId || '';
  }

  private static getDetailItemTitle(): string {
    let itemTitle = document.querySelector('.item-field-name')?.textContent;
    if (!itemTitle) {
      const titleInput = document.querySelector(
        'input#name'
      ) as HTMLInputElement;
      itemTitle = titleInput.value;
    }
    return itemTitle || '';
  }

  private static async getItemDescription(
    itemIdSelector: () => string,
    itemTitleSelector: () => string
  ): Promise<string> {
    const itemId = itemIdSelector();
    const itemTitle = itemTitleSelector();
    const delimiter = await getDelimiter();
    return `${itemId}${delimiter}${itemTitle}`;
  }

  private static getItemUrl(itemIdSelector: () => string): string {
    const origin = window.location.origin;
    const itemId = itemIdSelector();
    if (!origin || !itemId) {
      return '';
    }
    return `${origin}/viewitem?id=${itemId}&type=features&force_use_number=true`;
  }

  private static buildClipboardItem(itemUrl: string, itemDescription: string) {
    const html = `<a href=\"${itemUrl}\">${itemDescription}</a>`;
    const htmlMimeType = 'text/html';
    const textMimeType = 'text/plain';

    return new clipboard.ClipboardItem({
      [htmlMimeType]: new Blob([html], {
        type: htmlMimeType,
      }),
      [textMimeType]: new Blob([itemUrl], {
        type: textMimeType,
      }),
    });
  }
}
