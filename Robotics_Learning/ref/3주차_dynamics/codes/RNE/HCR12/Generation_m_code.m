fid = fopen('M.txt','wt');
fprintf(fid, 'm11 = %s; \n', char(mass(1,1)));
fprintf(fid, 'm12 = %s; \n', char(mass(1,2)));
fprintf(fid, 'm13 = %s; \n', char(mass(1,3)));
fprintf(fid, 'm14 = %s; \n', char(mass(1,4)));
fprintf(fid, 'm15 = %s; \n', char(mass(1,5)));
fprintf(fid, 'm16 = %s; \n', char(mass(1,6)));

fprintf(fid, 'm21 = %s; \n', char(mass(2,1)));
fprintf(fid, 'm22 = %s; \n', char(mass(2,2)));
fprintf(fid, 'm23 = %s; \n', char(mass(2,3)));
fprintf(fid, 'm24 = %s; \n', char(mass(2,4)));
fprintf(fid, 'm25 = %s; \n', char(mass(2,5)));
fprintf(fid, 'm26 = %s; \n', char(mass(2,6)));

fprintf(fid, 'm31 = %s; \n', char(mass(3,1)));
fprintf(fid, 'm32 = %s; \n', char(mass(3,2)));
fprintf(fid, 'm33 = %s; \n', char(mass(3,3)));
fprintf(fid, 'm34 = %s; \n', char(mass(3,4)));
fprintf(fid, 'm35 = %s; \n', char(mass(3,5)));
fprintf(fid, 'm36 = %s; \n', char(mass(3,6)));

fprintf(fid, 'm41 = %s; \n', char(mass(4,1)));
fprintf(fid, 'm42 = %s; \n', char(mass(4,2)));
fprintf(fid, 'm43 = %s; \n', char(mass(4,3)));
fprintf(fid, 'm44 = %s; \n', char(mass(4,4)));
fprintf(fid, 'm45 = %s; \n', char(mass(4,5)));
fprintf(fid, 'm46 = %s; \n', char(mass(4,6)));

fprintf(fid, 'm51 = %s; \n', char(mass(5,1)));
fprintf(fid, 'm52 = %s; \n', char(mass(5,2)));
fprintf(fid, 'm53 = %s; \n', char(mass(5,3)));
fprintf(fid, 'm54 = %s; \n', char(mass(5,4)));
fprintf(fid, 'm55 = %s; \n', char(mass(5,5)));
fprintf(fid, 'm56 = %s; \n', char(mass(5,6)));

fprintf(fid, 'm61 = %s; \n', char(mass(6,1)));
fprintf(fid, 'm62 = %s; \n', char(mass(6,2)));
fprintf(fid, 'm63 = %s; \n', char(mass(6,3)));
fprintf(fid, 'm64 = %s; \n', char(mass(6,4)));
fprintf(fid, 'm65 = %s; \n', char(mass(6,5)));
fprintf(fid, 'm66 = %s; \n', char(mass(6,6)));

fclose(fid);
'mass'


fid = fopen('C.txt','wt');
fprintf(fid, 'c11 = %s; \n', char(coriolis(1,1)));
fprintf(fid, 'c12 = %s; \n', char(coriolis(1,2)));
fprintf(fid, 'c13 = %s; \n', char(coriolis(1,3)));
fprintf(fid, 'c14 = %s; \n', char(coriolis(1,4)));
fprintf(fid, 'c15 = %s; \n', char(coriolis(1,5)));
fprintf(fid, 'c16 = %s; \n', char(coriolis(1,6)));

fprintf(fid, 'c21 = %s; \n', char(coriolis(2,1)));
fprintf(fid, 'c22 = %s; \n', char(coriolis(2,2)));
fprintf(fid, 'c23 = %s; \n', char(coriolis(2,3)));
fprintf(fid, 'c24 = %s; \n', char(coriolis(2,4)));
fprintf(fid, 'c25 = %s; \n', char(coriolis(2,5)));
fprintf(fid, 'c26 = %s; \n', char(coriolis(2,6)));

fprintf(fid, 'c31 = %s; \n', char(coriolis(3,1)));
fprintf(fid, 'c32 = %s; \n', char(coriolis(3,2)));
fprintf(fid, 'c33 = %s; \n', char(coriolis(3,3)));
fprintf(fid, 'c34 = %s; \n', char(coriolis(3,4)));
fprintf(fid, 'c35 = %s; \n', char(coriolis(3,5)));
fprintf(fid, 'c36 = %s; \n', char(coriolis(3,6)));

fprintf(fid, 'c41 = %s; \n', char(coriolis(4,1)));
fprintf(fid, 'c42 = %s; \n', char(coriolis(4,2)));
fprintf(fid, 'c43 = %s; \n', char(coriolis(4,3)));
fprintf(fid, 'c44 = %s; \n', char(coriolis(4,4)));
fprintf(fid, 'c45 = %s; \n', char(coriolis(4,5)));
fprintf(fid, 'c46 = %s; \n', char(coriolis(4,6)));

fprintf(fid, 'c51 = %s; \n', char(coriolis(5,1)));
fprintf(fid, 'c52 = %s; \n', char(coriolis(5,2)));
fprintf(fid, 'c53 = %s; \n', char(coriolis(5,3)));
fprintf(fid, 'c54 = %s; \n', char(coriolis(5,4)));
fprintf(fid, 'c55 = %s; \n', char(coriolis(5,5)));
fprintf(fid, 'c56 = %s; \n', char(coriolis(5,6)));

fprintf(fid, 'c61 = %s; \n', char(coriolis(6,1)));
fprintf(fid, 'c62 = %s; \n', char(coriolis(6,2)));
fprintf(fid, 'c63 = %s; \n', char(coriolis(6,3)));
fprintf(fid, 'c64 = %s; \n', char(coriolis(6,4)));
fprintf(fid, 'c65 = %s; \n', char(coriolis(6,5)));
fprintf(fid, 'c66 = %s; \n', char(coriolis(6,6)));
fclose(fid);
'coriolis'

fid = fopen('G.txt','wt');
fprintf(fid, 'g1 = %s; \n', char(gravity(1,1)));
fprintf(fid, 'g2 = %s; \n', char(gravity(2,1)));
fprintf(fid, 'g3 = %s; \n', char(gravity(3,1)));
fprintf(fid, 'g4 = %s; \n', char(gravity(4,1)));
fprintf(fid, 'g5 = %s; \n', char(gravity(5,1)));
fprintf(fid, 'g6 = %s; \n', char(gravity(6,1)));
'gravity'
fclose(fid);
