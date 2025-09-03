const express = require('express');
const router = express.Router();
const storageController = require('../controllers/storageController');

// ===== VOLUMES ROUTES =====
router.get('/volumes', storageController.getAllVolumes);
router.get('/volumes/:id', storageController.getVolumeById);
router.post('/volumes', storageController.createVolume);
router.put('/volumes/:id', storageController.updateVolume);
router.delete('/volumes/:id', storageController.deleteVolume);

// ===== VOLUME SNAPSHOTS ROUTES =====
router.get('/volume-snapshots', storageController.getAllVolumeSnapshots);
router.get('/volume-snapshots/:id', storageController.getVolumeSnapshotById);
router.post('/volume-snapshots', storageController.createVolumeSnapshot);
router.put('/volume-snapshots/:id', storageController.updateVolumeSnapshot);
router.delete('/volume-snapshots/:id', storageController.deleteVolumeSnapshot);



// ===== BUCKETS ROUTES =====
router.get('/buckets', storageController.getAllBuckets);
router.get('/buckets/:id', storageController.getBucketById);
router.post('/buckets', storageController.createBucket);
router.put('/buckets/:id', storageController.updateBucket);
router.delete('/buckets/:id', storageController.deleteBucket);

// ===== SHARED FILE SYSTEMS ROUTES =====
router.get('/shared-file-systems', storageController.getAllSharedFileSystems);
router.get('/shared-file-systems/:id', storageController.getSharedFileSystemById);
router.post('/shared-file-systems', storageController.createSharedFileSystem);
router.put('/shared-file-systems/:id', storageController.updateSharedFileSystem);
router.delete('/shared-file-systems/:id', storageController.deleteSharedFileSystem);

module.exports = router; 