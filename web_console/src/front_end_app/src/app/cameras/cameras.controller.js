export default class CamerasController {
    constructor(camerasResolved, filterTypesResolved, camerasService, filtersService, alertService, $q) {
        this.camerasArray = camerasResolved.cameras;
        this.filterTypesArray = filterTypesResolved.filter_types;
        this.camerasService = camerasService;
        this.filtersService = filtersService;
        this.alertService = alertService;
        this.$q = $q;

        for (let camera of this.camerasArray) {
            camera.localUrl = CamerasController.makeStreamUrl(camera);
        }
    }

    addCamera(camera) {
        let promise = this.camerasService.addCamera(camera);

        this.$q.when(promise).then((result) => {
            if (result.code !== 200) {
                this.alertService.add("danger", result.message);
                return;
            }

            this.alertService.add("success", result.message);

            let camera = result.camera;
            camera.localUrl = CamerasController.makeStreamUrl(camera);
            this.camerasArray.push(camera);
        });
    }

    removeCamera(camera) {
        if (!confirm("Are you sure?")) {
            return;
        }

        if (!Array.isArray(this.camerasArray) || !this.camerasArray.length) {
            return;
        }

        let promise = this.camerasService.removeCamera(camera);

        this.$q.when(promise).then((result) => {
            if (result.code !== 200) {
                this.alertService.add("danger", result.message);
                return;
            }

            this.alertService.add("success", result.message);

            let index = this.camerasArray.indexOf(camera);
            if (index !== -1) {
                this.camerasArray.splice(index, 1);
            }
        });
    }

    addFilter(camera, filterType) {
        if (filterType === undefined) {
            this.alertService.add("danger", "Filter type is not selected.");
            return;
        }

        let promise = this.filtersService.addFilter(camera, filterType);

        this.$q.when(promise).then((result) => {
            if (result.code !== 200) {
                this.alertService.add("danger", result.message);
                return;
            }

            this.alertService.add("success", result.message);
        });
    }

    static makeStreamUrl(camera) {
        if (Array.isArray(camera.topics_list) && camera.topics_list.length) {
            let imageTopicIndex = camera.topics_list.findIndex(c => c[1] === "sensor_msgs/Image");

            return "http://localhost:8888/stream?topic=" + camera.topics_list[imageTopicIndex][0];
        }
        return "";
    }
}

CamerasController.$inject = [
    'camerasResolved',
    'filterTypesResolved',
    'CamerasService',
    'FiltersService',
    'AlertService',
    '$q'
];
