import sys
import os
from fractions import Fraction
import math
from config import n100
from utils import convert_time_granularity, load_process
import pandas as pd
import numpy as np
from wind_power_transformation import speed_to_power


def would_it_work(process, wind_power, time_granularity,
                  starting_point, battery_level, battery_capacity, num_turbine,
                  ):
    """
    Input:
      process, power profile of a process.
      windspeed, wind speed of each time step.
      starting_point, the point of time when the process starts.
      battery_capacity, the max level of battery.
      battery_level, the battery_level when the process starts. 
    Output:
      False if it would not work, otherwise new battery level.


    """
    # the current production phase
    wind_power = wind_power*num_turbine

    # # unit conversion:
    M2H = Fraction(time_granularity, 60)

    # the counter to determine the industrial process phase
    counter = 1

    # duration of the wind speed time series (in 10 min steps)
    length = len(wind_power)

    if starting_point+len(process) > length:
        return False

    # simulate the next industrial process, time_process: the time for a whole industrial process
    for time_idx in range(len(process)):

        # calculte the new current battery level
        battery_level = battery_level + M2H * \
            (wind_power[time_idx+starting_point]-process[time_idx])

        # battery level cannot excceed its capacity
        battery_level = np.minimum(battery_level, battery_capacity)

        # out of battery: the simulation shows it cannot proceed another process from time t
        if battery_level < 0:
            return False

    # if we arrive here, we have completed the industrial process with positive
    # battery energy

    return True


def workable_candidate(process, wind_power, time_granularity, num_turbine, battery_capacity=1000, step_size=10):

    # unit conversion of time step
    # M2H = Fraction(time_granularity, 60)
    real_time = 0
    candidates = 0
    total_candidates = 0

    while real_time < len(wind_power)-len(process):
        total_candidates += 1
        battery_level = 0
        # print('Simulating the next process......')
        candidates += would_it_work(process=process, wind_power=wind_power, time_granularity=time_granularity,
                                    starting_point=real_time, battery_level=battery_level, battery_capacity=battery_capacity, num_turbine=num_turbine)
        real_time += step_size

    return candidates, total_candidates


def get_fractions_FMI(process, battery_capacity, time_granularity_process, time_granularity_wind=10, step_size=10):
    new_time_granularity = math.gcd(
        time_granularity_process, time_granularity_wind)
    workable_fractions = []
    wind_data_dir = "./data/windspeed_stations_2021"
    for file in os.listdir(wind_data_dir):
        if not file.startswith("."):
            # Read weather data from csv
            weather_df = pd.read_csv(os.path.join(wind_data_dir, file))
            weather_df['Wind speed (m/s)'] = weather_df['Wind speed (m/s)'].replace('-',
                                                                                    None).astype(float)
            weather_df['Wind speed (m/s)'].interpolate(method='linear',
                                                       inplace=True)
            weather_df['Wind speed (m/s)'] = weather_df['Wind speed (m/s)'].apply(
                lambda x: np.maximum(x, 0))

            weather_df = weather_df[['Wind speed (m/s)']]

            column_names = pd.MultiIndex.from_arrays(
                [['wind_speed'], ['10']], names=['variable_name', 'height'])

            weather_df.columns = column_names
            weather_df['roughness_length', '0'] = 0.15
            weather_df.fillna(weather_df.mean(
                numeric_only=True).round(2), inplace=True)
            power = speed_to_power(weather_df, my_turbine=n100)
            power = convert_time_granularity(power, 10, 1)
            workable_cans, total_cans = workable_candidate(process, power, time_granularity=new_time_granularity, num_turbine=1,
                                                           battery_capacity=battery_capacity, step_size=step_size)
            workable_fractions.append(
                {'city': file[:-4], 'val': workable_cans/total_cans})
    return workable_fractions

# def workable_fraction(process, wind_speed, time_granularity, r_turbine, num_turbine, conversion_factor, battery_capacity=1000, step_size=10):

#     # calculate the tatal area of wind turbines
#     S_turbine = num_turbine*math.pi*pow(r_turbine, 2)

#     # unit conversion of time step
#     M2H = Fraction(time_granularity, 60)

#     # the counter to determine when to simulate the next whole process
#     counter_process = 0

#     process_power_time_series = np.zeros(len(wind_speed))

#     real_time = 0
#     battery_level = battery_capacity
#     while real_time < len(wind_speed)-len(process):
#         # print('Simulating the next process......')
#         result = would_it_work(process, wind_speed, real_time,
#                                battery_level, battery_capacity, S_turbine, conversion_factor)

#         # the simulation shows it can work for the next phase, start the industrial process
#         if result:
#             # print('Yes, it would work! Get started!')
#             # battery level cannot excceed its capacity
#             battery_level = result
#             # print(f'Current battery level is: {battery_level}')

#             # fast-forward to the end of the process
#             process_power_time_series[real_time:(
#                 real_time+len(process))] = process
#             real_time += len(process)

#         # the simulation shows it cannot work for the next phase, store wind energy in the battery
#         else:
#             # print('Nooo! Please wait for the battery to charge!')
#             wind_power = pow(wind_speed[real_time],
#                              3)*conversion_factor*S_turbine

#             # store the wind energy into battery
#             battery_level = battery_level + M2H*wind_power
#             battery_level = np.minimum(battery_level, battery_capacity)
#             # print(f'Current battery level is: {battery_level}')
#             real_time += step_size
#     return np.sum(process_power_time_series > 0)/len(wind_speed)


if __name__ == "__main__":
    from config import my_turbine, Num_turbine
    process = np.array([364, 364, 196, 196, 196, 196, 42, 42])
    time_granularity_wind = 10
    time_granularity_process = 10
    new_time_granularity = math.gcd(
        time_granularity_wind, time_granularity_process)
    wind_data_file = 'data/Kumpula2021.csv'
    wind_power = speed_to_power(wind_data_file, my_turbine)
    workable_cans = workable_candidate(process, wind_power, time_granularity=new_time_granularity,
                                       num_turbine=Num_turbine, battery_capacity=1000, step_size=10)
    print(workable_cans)
