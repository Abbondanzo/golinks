import express from 'express';
import { LINKS } from './links';
import { Application } from './Application';

const app = express();

app.get('/', (__req, res) => res.send(Application.printHTML()));

app.get('/*', (req, res) => {
    const { url, ignoredPaths } = Application.getLinkItem(req.path);
    if (!url) {
        return res.send('<h1>Invalid link. Try the following:</h1>' + Application.printHTML());
    }
    res.redirect(ignoredPaths ? `${url.replace(/\/$/, '')}/${ignoredPaths}` : url);
});

const PORT = 6999;
const server = app.listen(PORT, () => console.log(`Example app listening on PORT ${PORT}!`));

/**
 * ============
 * Hot module reloading
 */
declare const module: any;

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => server.close());
}
