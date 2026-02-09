close all; clc;

current_path_kinematics = pwd;

% add HCR\kinematics folder
addpath('kinematics_common');
addpath('forward_kinematics');
addpath('kinematic_unit_test');
addpath(genpath('inverse_kinematics'));

% add robot toolbox
addpath('..\..\1주차_setup\robot_define\sixlink\');
addpath('..\..\1주차_setup\robot_define\common\');
addpath('..\..\1주차_setup\robot_library\rvctools_9\');
startup_rvc;