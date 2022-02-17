# SHM_Car_Pendulum
Javascript of a car in SHM with a pendulum attached to it. Car is in SHM along the X axis, forces acting on the pendulum are gravity along the Y axis and the acceleration of the car along the X axis.

The method of update is smooth, deterministic and fixed. The update loop in on a fixed timer and user input and rendering is done outside of the timer. The timer for the update loop decides number of update operations to perform before rendering, however each update is of a constant amount. The smoothness comes from interpolated rendering, i.e. the rendering function interpolates what to render based on the lag from the last update operation.

User inputs -
h - hold the car. The car and the pendulum will stop in place
r - resume motion of the car and pendulum
arrowUp - increase forward swing speed of the pendulum
arrowDown - increase backward swing speed of the pendulum
arrowLeft - move car left
arrowRight - move car right
note: the arrow keys will only work if the car is stopped by pressing h

slider - will control millisecond required for the update loop
