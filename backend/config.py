import os

from windpowerlib import WindTurbine
import pandas as pd


ORIGIN = os.environ.get("ORIGIN", "http://localhost:3000") 

BATTERY_CAPACITY = 1000

# radius of a turbine is r_turbine=10 meters
R_turbine = 10

# there are 10 turbines
Num_turbine = 1

# the wind power equation is p=v*v*v*0.0006 in W
Conversion_factor = 0.6

# specification of own wind turbine (Note: power curve values and
# nominal power have to be in Watt)
my_turbine = {
    'nominal_power': 3e6,  # in W
    'hub_height': 105,  # in m
    'power_curve': pd.DataFrame(
        data={'value': [p * 1000 for p in [
            0.0, 26.0, 180.0, 1500.0, 3000.0, 3000.0]],  # in W
            'wind_speed': [0.0, 3.0, 5.0, 10.0, 15.0, 25.0]})  # in m/s
}
# initialize WindTurbine object
my_turbine = WindTurbine(**my_turbine)
n100 = {
    'hub_height': 100,
    'turbine_type': 'N100/2500'}
n100 = WindTurbine(**n100)
