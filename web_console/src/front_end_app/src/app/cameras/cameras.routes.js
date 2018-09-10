routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider
        .state('cameras', {
            url: '/cameras',
            template: require('./cameras.html'),
            controller: 'CamerasController',
            controllerAs: 'cameras',
            resolve: {
                cameras: function (CamerasService) {
                    return CamerasService.getCamerasList();
                }
            }
        });
}
