const storageKey = 'axosoft-link-copier';
const defaultDelimiter = ' - ';

interface IStorageObj {
  delimiter: string;
  shortcutIsEnabled: boolean;
}

export async function getDelimiter(): Promise<string> {
  return await getStorageObj()
    .then((storageObj: IStorageObj) => {
      if (!storageObj?.delimiter) {
        return setDelimiter(defaultDelimiter).then(() => defaultDelimiter);
      }
      return storageObj.delimiter;
    })
    .catch(() => defaultDelimiter);
}

export async function setDelimiter(delimiter: string): Promise<void> {
  const storageObj = await getStorageObj();
  await setStorageObj(Object.assign({}, storageObj, { delimiter }));
}

export async function getShortcutIsEnabled(): Promise<boolean> {
  return await getStorageObj()
    .then((storageObj: IStorageObj) => storageObj.shortcutIsEnabled)
    .catch(() => false);
}

export async function setShortcutIsEnabled(
  shortcutIsEnabled: boolean
): Promise<void> {
  const storageObj = await getStorageObj();
  await setStorageObj(
    Object.assign({}, storageObj, {
      shortcutIsEnabled: Boolean(shortcutIsEnabled),
    })
  );
}

export function onShortcutEnabledChanged(
  callback: (isEnabled: boolean) => void
) {
  browser.storage.onChanged.addListener(function (changes) {
    const newStorageObj: IStorageObj = changes[storageKey]?.newValue;
    if (!newStorageObj) {
      return;
    }
    callback(newStorageObj.shortcutIsEnabled);
  });
}

async function getStorageObj(): Promise<IStorageObj> {
  const record = await browser.storage.local.get(storageKey);
  return record[storageKey];
}

function setStorageObj(storageObj: IStorageObj): Promise<void> {
  return browser.storage.local.set({ [storageKey]: storageObj });
}
