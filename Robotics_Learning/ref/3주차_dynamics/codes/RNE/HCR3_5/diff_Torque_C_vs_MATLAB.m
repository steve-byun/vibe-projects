 a = load('output.txt');
 
 diff_Torque1 = Torque11' - a(:,1);
 diff_Torque2 = Torque21' - a(:,2);
 diff_Torque3 = Torque31' - a(:,3);
 diff_Torque4 = Torque41' - a(:,4);
 diff_Torque5 = Torque51' - a(:,5);
 diff_Torque6 = Torque61' - a(:,6);
 
 diff_Torque = [diff_Torque1 diff_Torque2 diff_Torque3 diff_Torque4 diff_Torque5 diff_Torque6];
 