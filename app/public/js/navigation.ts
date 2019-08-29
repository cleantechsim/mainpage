
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
        this.iFrames[0].style.opacity = "1.0";
        this.iFrames[1].style.opacity = "0";

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
        var loadEventListener = () => {

            try {
                // swap z-index on transition end so that input hits
                // the now opaque iframe
                var transitionEndListener = () => {

                    try {
                        // Must swap z-index
                        t.iFrames[iFrameToLoad].style.zIndex = "1";
                        t.iFrames[iFrameToHide].style.zIndex = "0";

                        // Loading done, update
                        this.setNotLoadingAnymoreAndUpdateDisplayed(iFrameToLoad, divElement);
                    }
                    finally {
                        t.iFrames[iFrameToLoad].removeEventListener('transitionend', transitionEndListener);
                    }
                };

                t.iFrames[iFrameToLoad].addEventListener('transitionend', transitionEndListener)

                // Swap iframes by adjusting opacity
                // CSS can define a transition for this
                t.iFrames[iFrameToLoad].style.opacity = "1.0";
                t.iFrames[iFrameToHide].style.opacity = "0";

                if (spinner) {
                    t.stopSpinner(spinner);
                }
            }
            finally {
                t.iFrames[iFrameToLoad].removeEventListener('load', loadEventListener);
            }
        }

        t.iFrames[iFrameToLoad].addEventListener('load', loadEventListener);

        console.log('## Page config for ' + JSON.stringify(pageConfig));

        this.isLoading = true;
        t.iFrames[iFrameToLoad].src = pageConfig.pageUrl;
    }

    private setNotLoadingAnymoreAndUpdateDisplayed(iFrameToLoad: number, divElement: HTMLDivElement): void {
        this.displayedIFrame = iFrameToLoad;
        this.isLoading = false;
        this.activeDiv = divElement;
    }
}
