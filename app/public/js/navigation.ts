
export class NavigationModel {

    pages: Page[];

    encodedModel: string;

    constructor(pages: Page[]) {
        this.pages = pages;
        this.encodedModel = '';
    }
}

export class Page {

    title: string;
    pageUrl: string;

    constructor(title: string, pageUrl: string) {
        this.title = title;
        this.pageUrl = pageUrl;
    }
}

export class NavigationEventHandling {

    pageElements: HTMLDivElement[];
    pageConfigs: Page[];
    iFrames: HTMLIFrameElement[];
    iFramesWrapperElement: HTMLDivElement;
    createSpinner: (element: Element) => any;
    stopSpinner: (spinner: any) => void;

    activeDiv: HTMLDivElement;
    displayedIFrame: number;
    isLoading: boolean;

    constructor(
        pageElements: HTMLDivElement[],
        pageConfigs: Page[],
        iFrames: HTMLIFrameElement[],
        iFramesWrapperElement: HTMLDivElement,
        createSpinner: (element: Element) => any,
        stopSpinner: (spinner: any) => void) {


        this.pageElements = pageElements;
        this.pageConfigs = pageConfigs;
        this.iFrames = iFrames;
        this.iFramesWrapperElement = iFramesWrapperElement;
        this.createSpinner = createSpinner;
        this.stopSpinner = stopSpinner;

        console.log('## page configs ' + JSON.stringify(pageConfigs));

        if (pageElements.length != pageConfigs.length) {
            throw "Mismatch in page elements and page configs";
        }

        if (iFrames.length != 2) {
            throw "Expected 2 iframes";
        }

        this.activeDiv = pageElements[0];
        this.displayedIFrame = 0;
        this.isLoading = false;
    }

    public start(): void {

        for (var i: number = 0; i < this.pageElements.length; ++i) {
            this.addEventHandlingForPage(this.pageElements[i], this.pageConfigs[i]);
        }

        this.loadPage(this.pageElements[0], this.pageConfigs[0]);
    }

    private addEventHandlingForPage(divElement: HTMLDivElement, pageConfig: Page): void {

        var t = this;

        divElement.onclick = event => {

            if (divElement !== t.activeDiv && !t.isLoading) {
                this.loadPage(divElement, pageConfig);
            }
        }
    }


    private loadPage(divElement: HTMLDivElement, pageConfig: Page): void {

        if (this.isLoading) {
            throw "Already loading";
        }

        var spinner: any;

        // Switch by loading and setting opacity
        var iFrameToLoad: number = this.displayedIFrame == 0 ? 1 : 0;
        var iFrameToHide: number = this.displayedIFrame == 0 ? 0 : 1;

        if (this.createSpinner) {
            spinner = this.createSpinner(this.iFramesWrapperElement);
        }

        var t = this;
        var eventListener = () => {

            // Swap iframes by adjusting opacity
            // CSS can define a transition for this
            t.iFrames[iFrameToLoad].style.opacity = "1.0";
            t.iFrames[iFrameToHide].style.opacity = "0";

            t.displayedIFrame = iFrameToLoad;
            t.isLoading = false;
            t.activeDiv = divElement;

            if (spinner) {
                t.stopSpinner(spinner);
            }

            t.iFrames[iFrameToLoad].removeEventListener('load', eventListener);
        }

        t.iFrames[iFrameToLoad].addEventListener('load', eventListener);

        console.log('## Page config for ' + JSON.stringify(pageConfig));

        this.isLoading = true;
        t.iFrames[iFrameToLoad].src = pageConfig.pageUrl;
    }
}
