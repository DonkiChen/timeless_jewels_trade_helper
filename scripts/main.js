'use strict';

/*** worker.js */
class Config {
    constructor(host, pathname) {
        this.host = host;
        this.pathname = pathname;
    }

    replaceUrl(url) {
        if (url.host === this.host) {
            return;
        }
        url.host = this.host;
        url.pathname = this.pathname;

        const searchParams = url.searchParams;

        const q = JSON.parse(searchParams.get("q"));
        const query = q.query;
        // 物品名称英文不能直接用，偷懒直接删除。
        delete query.name;
        delete query.type;

        searchParams.set("q", JSON.stringify(q));
    }
}

const GGG = new Config(
    "www.pathofexile.com",
    "/trade/search/Sentinel"
)


const TX = new Config(
    "poe.game.qq.com",
    "/trade/search/S22赛季"
)

let config = GGG;

function init() {
    // 通过 hook open & 修改 url 的方式实现
    const originOpen = window.open;
    window.open = function (url) {
        config.replaceUrl(url);
        originOpen(url);
    }
}

function onHostChanged(value) {
    switch (value) {
        case "GGG":
            config = GGG;
            break;
        case "TX":
            config = TX;
            break;
        default:
            break;
    }
}

/*** render.js */


const domTemplate = `
<div style="position:absolute;top:48px;right:16px;padding:8px;font-size:16px" class="bg-neutral-500/30">
<div style="display:flex;align-items:center;gap:4px">
    <input type="radio" value="GGG" name="host" id="GGG" style="width:12px;height:12px;">
    <label for="GGG">GGG</label>
</div>
<div style="display:flex;align-items:center;gap:4px">
    <input type="radio" value="TX" name="host" id="TX" style="width:auto;height:auto;">
    <label for="TX">TX</label>
</div>
</div>
`

function render(savedHost, onChangeListener) {
    const parser = new DOMParser();
    const node = parser.parseFromString(domTemplate, 'text/html');
    document.body.appendChild(node.documentElement.querySelector('body').firstChild);

    document.getElementsByName("host").forEach((item) => {
        item.addEventListener("change", (e) => {
            console.log(e);
            if (e.target.checked) {
                onChangeListener(e.target.value);
            }
        })
    })

    const radio = document.getElementById(savedHost ?? "GGG");
    radio.checked = true;
    const event = new Event('change');
    radio.dispatchEvent(event);
}


/*** main.js */



init();

const savedHost = window.localStorage.getItem("savedHost");
render(savedHost, (value) => {
    window.localStorage.setItem("savedHost", value);
    onHostChanged(value);
});
