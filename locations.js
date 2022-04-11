const db = require('./db.js');
const locations = require('express').Router();
const validate = require('jsonschema').validate;

// Define valid spec for location object
const locationSchema = {
    type: 'object',
    properties: {
        latitude: { type: 'number', minimum: -90, maximum: 90 },
        longitude: { type: 'number', minimum: -180, maximum: 180 },
    },
    required: ['latitude', 'longitude'],
    maxProperties: 2,
};

// Root returns all locations, filtered by optional parameters
locations.get('/', async (req, res) => {
    try {
        // Fall back to schema limits if param not given
        let params = [
            req.query.latmin ?? locationSchema.properties.latitude.minimum,
            req.query.latmax ?? locationSchema.properties.latitude.maximum,
            req.query.lonmin ?? locationSchema.properties.longitude.minimum,
            req.query.lonmax ?? locationSchema.properties.longitude.maximum,
            req.query.sort || 'id',
            req.query.order,
        ];
        let result = await db.findAll(params);
        res.status(200).send(result); // OK
    } catch (err) {
        res.status(500).send(err); // 500 Internal Server Error
    }
});
// Get location by id
locations.get('/:id([0-9]+)', async (req, res) => {
    try {
        let result = await db.findById(req.params.id);
        if (result) res.status(200).send(result);
        else res.status(404).send('Id not found');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add new location with POST
locations.post('/', async (req, res) => {
    // Return 400 Bad Request if invalid location data
    if (validate(req.body, locationSchema).errors.length) {
        res.status(400).send('Invalid location data');
    } else {
        try {
            let result = {
                id: await db.save(req.body),
                ...req.body,
            };
            res.status(201).send(result); // 201 Created
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

// Delete location matching url param
locations.delete('/:id([0-9]+)', async (req, res) => {
    try {
        let success = await db.deleteById(req.params.id);
        if (success) res.status(204).end(); // Delete ok, 204 No Content
        else res.status(404).send('Id not found'); // Nothing deleted
    } catch (err) {
        res.status(500).send(err);
    }
});
module.exports = locations;
