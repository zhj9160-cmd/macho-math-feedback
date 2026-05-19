import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

/**
 * @param {{ feedback: import('../data/schema').MonthlyFeedback }} props
 */
export default function RadarChart({ feedback }) {
  const score = parseInt(feedback.testScore) || 0

  const data = [
    { subject: '집중도', value: feedback.focus || 0 },
    { subject: '태도',   value: feedback.attitude || 0 },
    { subject: '이해도', value: Math.min(5, score / 20) },
    { subject: '꾸준함', value: Math.min(5, (feedback.homework   || 0) / 20) },
    { subject: '성장도', value: Math.min(5, (feedback.attendance || 0) / 20) },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsRadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke="#E5E7EB" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: '#2C2C2C' }}
        />
        <PolarRadiusAxis
          domain={[0, 5]}
          tickCount={6}
          tick={false}
          axisLine={false}
        />
        <Radar
          name="피드백"
          dataKey="value"
          stroke="#1B365D"
          fill="#C9A961"
          fillOpacity={0.3}
          strokeWidth={2}
          dot={{ fill: '#1B365D', r: 3 }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}
