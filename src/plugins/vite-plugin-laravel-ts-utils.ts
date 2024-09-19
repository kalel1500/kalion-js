import { existsSync } from 'fs';
import { resolve } from 'path';
import {Plugin} from "vite";

const optionalDependencies = [
    'bootstrap',
];

const isDependencyInstalled = (dep: string) => {
    try {
        const resolvedPath = resolve(`node_modules/${dep}`); // require.resolve(dep, { paths: [process.cwd()] });
        return existsSync(resolvedPath);
    } catch (e) {
        return false;
    }
};

export function laravelTsUtilsPlugin(): Plugin {
    const externalDependencies = optionalDependencies.filter(dep => !isDependencyInstalled(dep));

    return {
        name: 'laravel-ts-utils',
        config() {
            return {
                build: {
                    rollupOptions: {
                        external: externalDependencies
                    }
                }
            };
        }
    };
}