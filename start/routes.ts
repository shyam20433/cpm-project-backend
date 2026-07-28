import Route from '@ioc:Adonis/Core/Route'
//endpoints

Route.group(()=>{
  Route.get('/endpoints/access-details', 'EndpointsController.getAccessDetails')
  Route.get('/endpoints', 'EndpointsController.getEndpoints')
  Route.get('/endpoints/:id', 'EndpointsController.getEndpoint').middleware('jwtAuth')
  Route.post('/endpoints', 'EndpointsController.postEndpoint')
  Route.put('/endpoints/:id', 'EndpointsController.updateEndpoint')
  Route.delete('/endpoints/:id', 'EndpointsController.deleteEndpoint')
//roles
Route.get('/roles', 'RolesController.getRoles')
Route.get('/roles/:key', 'RolesController.getRole')
Route.post('/roles/setup', 'RolesController.setupRole')
Route.post('/roles', 'RolesController.postRole')
Route.put('/roles/:key', 'RolesController.updateRole')
Route.delete('/roles/:key', 'RolesController.deleteRole')

//permissions

Route.get('/permissions', 'PermissionsController.getPermissions')
Route.get('/permissions/:key', 'PermissionsController.getPermission')
Route.post('/permissions', 'PermissionsController.postPermission')
Route.put('/permissions/:key', 'PermissionsController.updatePermission')
Route.delete('/permissions/:key', 'PermissionsController.deletePermission')

//assigned roles
Route.get('/assigned-roles', 'AssignedRolesController.getAssignedRoles')
Route.get('/assigned-roles/:id', 'AssignedRolesController.getAssignedRole')
Route.post('/assigned-roles', 'AssignedRolesController.postAssignedRole')
Route.put('/assigned-roles/:id', 'AssignedRolesController.updateAssignedRole')
Route.delete('/assigned-roles/:id', 'AssignedRolesController.deleteAssignedRole')

//asigned permissions
Route.get('/assigned-permissions', 'AssignedPermissionsController.getAssignedPermissions')
Route.get(
  '/assigned-permissions/:roleKey/:permissionKey',
  'AssignedPermissionsController.getAssignedPermission'
)
Route.post('/assigned-permissions', 'AssignedPermissionsController.postAssignedPermission')
Route.put(
  '/assigned-permissions/:roleKey/:permissionKey',
  'AssignedPermissionsController.updateAssignedPermission'
)
Route.delete(
  '/assigned-permissions/:roleKey/:permissionKey',
  'AssignedPermissionsController.deleteAssignedPermission'
)

//assigned endpoints
Route.get('/assigned-endpoints', 'AssignedEndpointsController.getAssignedEndpoints')
Route.get(
  '/assigned-endpoints/:endpointId/:permissionKey',
  'AssignedEndpointsController.getAssignedEndpoint'
)
Route.post('/assigned-endpoints', 'AssignedEndpointsController.postAssignedEndpoint')
Route.put(
  '/assigned-endpoints/:endpointId/:permissionKey',
  'AssignedEndpointsController.updateAssignedEndpoint'
)
Route.delete(
  '/assigned-endpoints/:endpointId/:permissionKey',
  'AssignedEndpointsController.deleteAssignedEndpoint'
)
Route.post('/setup-all', 'SetupAllController.setupAll')

}).middleware('jwtAuth')

Route.post('/login', 'AuthController.login')



