import { LINKS } from './links';

type FlatUrl = { key: string; value: string };

export class Application {
    static flatMap() {
        const objectToTuple = (rootKey: string, object: any): FlatUrl[] => {
            const urls: FlatUrl[] = [];
            Object.keys(object).forEach(key => {
                const value = object[key];

                if (typeof value === 'object') {
                    urls.push(...objectToTuple(key, value));
                    return;
                }
                if (key === 'default') {
                    urls.push({ key: rootKey, value });
                    return;
                }
                urls.push({ key: rootKey ? `${rootKey}/${key}` : key, value });
            });
            return urls;
        };
        return objectToTuple('', LINKS);
    }

    static printHTML() {
        const rows = this.flatMap().map(flatUrl => {
            return `
            <tr>
                <td style="padding: 1em">
                    <b>${flatUrl.key}</b>
                </td>
                <td style="padding: 1em">
                    ${flatUrl.value}
                </td>
            </tr>`;
        });

        return `<table style="width: 100%;" border=1;>${rows}</table>`;
    }

    static getLinkItem(path: string) {
        const links = path.split('/').filter(key => !!key);
        const mapping = this.flatMap();
        let flatPath;
        const ignoredPaths: string[] = [];
        while (links.length && !flatPath) {
            flatPath = mapping.find(flatUrl => flatUrl.key === links.join('/'));
            if (!flatPath) {
                ignoredPaths.unshift(links.pop());
            }
        }

        const url = flatPath ? `${flatPath.value.replace(/\/$/, '')}` : null;
        return { url, ignoredPaths: ignoredPaths.join('/') };
    }
}
