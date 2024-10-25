```ts
function testUseBootstrapWhenIsNotInstalled() {
    console.log('llega');
    g.startTooltips();
    console.log('continua?');
}

function testConstants() {
    Test.printConstant();
    console.log('-------------------------');
    console.log(_const('lang'));
    console.log(_const('anotherSetting'));

    console.log('-------------------------');
    console.log('-------------------------');
    console.log('-------------------------');

    Test.printTranslation();
    console.log('-------------------------');
    console.log(__('contact_pi_team'));
    console.log(__('test_message'));
    console.log(__('qqq'));
}

function testMutationObserve() {
    Mutation.observe({
        elementId: 'drawer-navigation',
        class: '-translate-x-full',
        whenHave: () => {
            console.log('cerrado');
        },
        whenHavent: () => {
            console.log('abierto');
        }
    });
}
```