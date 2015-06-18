package service

func MovingAverageFloat(num int, values []float64) float64 {
	innerAverages := make([]float64, 0)
	for i := 0; i < len(values) - num; i++ {
		sum := float64(0)
		for j := i; j < i + num; j++ {
			sum += values[j]
		}
		innerAverages = append(innerAverages, (sum / float64(num)))
	}
	sum := float64(0)
	for _, inner := range innerAverages {
		sum += inner
	}
	return sum / float64(len(innerAverages))
}
