py = [100, 100.5, 101.5, 103, 105, 107.5, 110.5, 114, 118, 122.5, 127.5, 133, 139, 145.5, 152.5, 160, 168, 176.5, 185.5, 195, 205, 215.5, 226.5, 238, 250, 262.5, 275.5, 289, 303, 317.5, 332.5, 348, 364, 380.5, 397.5, 415, 433, 451.5, 470.5, 490, 510, 489.5, 469.5, 450, 431, 412.5, 394.5, 377, 360, 343.5, 327.5, 312, 297, 282.5, 268.5, 255, 242, 229.5, 217.5, 206, 195, 184.5, 174.5, 165, 156, 147.5, 139.5, 132, 125, 118.5, 112.5, 107, 102, 97.5, 93.5, 90, 87, 84.5, 82.5, 81, 80]
vy = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, -20, -19.5, -19, -18.5, -18, -17.5, -17, -16.5, -16, -15.5, -15, -14.5, -14, -13.5, -13, -12.5, -12, -11.5, -11, -10.5, -10, -9.5, -9, -8.5, -8, -7.5, -7, -6.5, -6, -5.5, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5]
import matplotlib.pyplot as plt

plt.plot(py)
plt.show()

# 속도가 음수로 바뀐 부분(rev) 을 기준으로 나누고 후자에 -를 곱했을 때
# [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5,
# [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20 ]
# 완전히 동일하지만 마지막 값이 *하나가 삭제됨*
# 원인이라고 판단함