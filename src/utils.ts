import {dirname, join} from 'path';
import * as fs from 'fs';
import {Stats} from 'fs';

import * as mkdirp from 'mkdirp';

export const sep = '\n';

export const log = <T>(message: string, arg?: T) => {
    console.log(message, arg || '');
    return arg;
};
export const error = <T>(message: string, arg?: T) => {
    console.error('❗️', message, arg || '');
    return arg;
};

const mkdir = (dir): Promise<string> => new Promise((resolve, reject) =>
    mkdirp(dir, (err, data) => err ? reject(err) : resolve(data))
);

export const readDir = (dir): Promise<string[]> => new Promise((resolve, reject) =>
    fs.readdir(dir, (err, data) => err ? reject(err) : resolve(data))
);

export const readFile = (file, encoding = 'utf8'): Promise<string> => new Promise((resolve, reject) =>
    fs.readFile(file, encoding, (err, data) => err ? reject(err) : resolve(data)));

const mkdirFile = (file): Promise<string> => Promise.resolve(dirname(file))
    .then(dir => mkdir(dir));

export const writeFile = (file, data) => mkdirFile(file)
    .then(() => new Promise((resolve, reject) =>
        fs.writeFile(file, data, err => err ? reject(err) : resolve()))
    );

const copyFile = (input, output) => readFile(input, null)
    .then(data => writeFile(output, data));

const lstat = (input): Promise<Stats> => new Promise((resolve, reject) =>
    fs.lstat(input, (err, data) => err ? reject(err) : resolve(data))
);

const copyAny = (src, dest) => lstat(src)
    .then(stat => {
        if (stat.isFile()) {
            return copyFile(src, dest)
        } else if (stat.isDirectory()) {
            return mkdir(dest)
                .then(() => copyDir(src, dest))
        }
        return Promise.reject(new Error(`Oops! unable to copy ${src}`))
    });

export const copyDir = (src, dest) => readDir(src)
    .then(files => files.map(file => copyAny(join(src, file), join(dest, file))))
    .then(copyingPromises => Promise.all(copyingPromises));