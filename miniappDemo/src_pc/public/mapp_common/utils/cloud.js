import { Cloud } from "@tbmp/mp-cloud-sdk";

const cloud = new Cloud();
cloud.init({
    // env: 'test',
    cloudId: 'v0jj5jyrnvry',
});

/**
 * 取到cloud
 * @returns {Cloud}
 */
export function getCloud () {
    return cloud;
}