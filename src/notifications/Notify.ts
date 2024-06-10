import {__const} from "../_internal/helpers";
import {LDate} from "../dates";
import {LStorage} from "../storage";
import {g} from "../helpers";

type LaunchParams = {
    title: string,
    body?: string,
    openUrl?: string
    when: "hidden" | "unfocused" | "all"
}

export class Notify {
    readonly #title: string;
    readonly #body?: string;
    readonly #openUrl?: string;

    static STORAGE = {
        getAll() {
            return LStorage.getItem("notified");
        },
        check(key: string) {
            return LStorage.getItem("notified") === key;
        },
        saveNotified(key: string) {
            LStorage.setItem("notified", key);
        },
        deleteNotified() {
            LStorage.removeItem("notified");
        },
    };

    constructor(title: string, body?: string, openUrl?: string) {
        this.#title = title;
        this.#body = body;
        this.#openUrl = openUrl;
    }

    /*original()
    {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification")
        }
        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            this.#createNotification()
        }
        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(r => {
                // If the user accepts, let's create a notification
                if (r === "granted") {
                    this.#createNotification()
                }
            });
        }
    }*/

    #createNotification() {
        const notification = new Notification(this.#title, {icon: __const("appIcon"), body: this.#body});
        notification.onclick = () => window.open(this.#openUrl);
    }

    static checkAndRequestPermission() {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission !== "denied" && Notification.permission !== "granted") {
            Notification.requestPermission().then();
        }
    }

    static launch({title = "titulo", body = undefined, openUrl = undefined, when}: LaunchParams) {
        if (when === "hidden" && document.visibilityState === "visible") return;
        if (when === "unfocused" && document.hasFocus()) return;

        const id = LDate.getTimeId();
        if (Notify.STORAGE.check(id)) {
            const rand = Math.floor(Math.random() * 100);
            g.consoleInfo(`notificacion evitada: [${id}_${rand}] -> ${body}`);
            return;
        }
        Notify.STORAGE.saveNotified(id);

        const notify = new Notify(title, body, openUrl);
        notify.#createNotification();
    }
}
