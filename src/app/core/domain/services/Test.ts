import { ___, __const } from '../../infrastructure/utilities/_internal/helpers';

export class Test {
    public static printConstant() {
        console.log(__const('lang'));
        console.log(__const('VITE_BROADCASTING_ENABLED'));
    }

    public static printTranslation() {
        console.log(___('no_results'));
    }
}