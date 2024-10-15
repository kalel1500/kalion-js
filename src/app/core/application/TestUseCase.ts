import { ___, __const } from '../infrastructure/utilities/_internal/helpers';

export class TestUseCase {
    public static printConstant() {
        console.log(__const("lang"));
        console.log(__const("VITE_BROADCASTING_ENABLED"));
    }

    public static printTranslation() {
        console.log(___("contact_pi_team"));
    }
}