import numpy as np
import rasterio
import rasterio.features
import rasterio.warp
import geojson

from pprint import pprint
from matplotlib import pyplot


LU_CLASS = {1: 'Bosque inundable', 2: 'Bosque no inundable', 3: 'Vegetacion secundaria',
            4: 'Humedales', 5: 'Sabana humedales', 6: 'Sabana', 7: 'Herbazal', 8: 'Pasto-Herbazal',
            9: 'Pasto', 10: 'Pasto-Agricultura', 11: 'Agricultura', 12: 'Agua', 13: 'Urbano', 14: 'Mineria',
            15: 'Suelo desnudo', 16: 'Aguajales'}

DATA_FOLDER = '../data/'
TIF_FOLDER = '{}tif/'.format(DATA_FOLDER)
with rasterio.open('{}LU_MAP_final_rec01.tif'.format(TIF_FOLDER)) as src:
    # Read the dataset's valid data mask as a ndarray.
    mask = src.dataset_mask()
    array = src.read()

    stats = []

    for band in array:
        stats.append({
            'min': band.min(),
            'mean': band.mean(),
            'median': np.median(band),
            'max': band.max()})

    pprint(stats)

    for k, v in LU_CLASS.items():
        print('Creating geojson for {}'.format(v))
        features = []

        array_cla = np.where(array == k, array, 128)

        # Extract feature shapes and values from the array.
        for geom, val in rasterio.features.shapes(array_cla[0], mask, transform=src.transform):
            # Transform shapes from the dataset's own coordinate
            # reference system to CRS84 (EPSG:4326).
            geom = rasterio.warp.transform_geom(src.crs, 'EPSG:4326', geom)

            features.append(geojson.Feature(geometry=geojson.MultiPolygon([geom['coordinates']])))

        with open('{data}/geojson/LU_{cla}.geojson'.format(data=DATA_FOLDER, cla=v), 'w', encoding='utf8') as fp:
            geojson.dump(geojson.FeatureCollection(features), fp, sort_keys=True, ensure_ascii=False)

        print('Finish creating {}'.format(v))
