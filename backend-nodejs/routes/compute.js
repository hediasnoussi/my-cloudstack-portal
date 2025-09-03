const express = require('express');
const router = express.Router();
const computeController = require('../controllers/computeController');

// ===== INSTANCES ROUTES =====
router.get('/instances', computeController.getAllInstances);
router.get('/instances/:id', computeController.getInstanceById);
router.post('/instances', computeController.createInstance);
router.put('/instances/:id', computeController.updateInstance);
router.delete('/instances/:id', computeController.deleteInstance);

// ===== INSTANCE SNAPSHOTS ROUTES =====
router.get('/instance-snapshots', computeController.getAllInstanceSnapshots);
router.get('/instance-snapshots/:id', computeController.getInstanceSnapshotById);
router.post('/instance-snapshots', computeController.createInstanceSnapshot);
router.put('/instance-snapshots/:id', computeController.updateInstanceSnapshot);
router.delete('/instance-snapshots/:id', computeController.deleteInstanceSnapshot);

// ===== KUBERNETES CLUSTERS ROUTES =====
router.get('/kubernetes-clusters', computeController.getAllKubernetesClusters);
router.get('/kubernetes-clusters/:id', computeController.getKubernetesClusterById);
router.post('/kubernetes-clusters', computeController.createKubernetesCluster);
router.put('/kubernetes-clusters/:id', computeController.updateKubernetesCluster);
router.delete('/kubernetes-clusters/:id', computeController.deleteKubernetesCluster);

// ===== AUTOSCALING GROUPS ROUTES =====
router.get('/autoscaling-groups', computeController.getAllAutoscalingGroups);
router.get('/autoscaling-groups/:id', computeController.getAutoscalingGroupById);
router.post('/autoscaling-groups', computeController.createAutoscalingGroup);
router.put('/autoscaling-groups/:id', computeController.updateAutoscalingGroup);
router.delete('/autoscaling-groups/:id', computeController.deleteAutoscalingGroup);

// ===== INSTANCE GROUPS ROUTES =====
router.get('/instance-groups', computeController.getAllInstanceGroups);
router.get('/instance-groups/:id', computeController.getInstanceGroupById);
router.post('/instance-groups', computeController.createInstanceGroup);
router.put('/instance-groups/:id', computeController.updateInstanceGroup);
router.delete('/instance-groups/:id', computeController.deleteInstanceGroup);



module.exports = router; 