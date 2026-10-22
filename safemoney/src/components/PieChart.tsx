import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { colors, fonts, spacing } from '../theme';
import { formatCurrency } from '../utils/format';
import { AppText } from './AppText';

export interface Slice {
  label: string;
  value: number;
  color: string;
}

export function PieChart({ data, size = 190 }: { data: Slice[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const c = size / 2;
  const r = size / 2 - 4;
  let start = -Math.PI / 2;

  const slices = data.map((d) => {
    const angle = (d.value / total) * Math.PI * 2;
    const end = start + angle;
    const p1 = { x: c + r * Math.cos(start), y: c + r * Math.sin(start) };
    const p2 = { x: c + r * Math.cos(end), y: c + r * Math.sin(end) };
    const path = `M${c} ${c} L${p1.x} ${p1.y} A${r} ${r} 0 ${angle > Math.PI ? 1 : 0} 1 ${p2.x} ${p2.y} Z`;
    start = end;
    return { ...d, path };
  });

  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`Spending by category. ${data
        .map((d) => `${d.label} ${Math.round((d.value / total) * 100)} percent`)
        .join(', ')}`}
    >
      <Svg width={size} height={size}>
        {slices.length === 1 ? (
          <Circle cx={c} cy={c} r={r} fill={slices[0]?.color} />
        ) : (
          slices.map((s) => <Path key={s.label} d={s.path} fill={s.color} stroke={colors.card} strokeWidth={2} />)
        )}
        <Circle cx={c} cy={c} r={r * 0.58} fill={colors.card} />
        <SvgText x={c} y={c - 2} fontSize={12} fill={colors.textMuted} textAnchor="middle" fontFamily={fonts.regular}>
          Spent
        </SvgText>
        <SvgText x={c} y={c + 18} fontSize={18} fill={colors.text} textAnchor="middle" fontFamily={fonts.bold}>
          {formatCurrency(total)}
        </SvgText>
      </Svg>

      <View style={styles.legend}>
        {data.map((d) => (
          <View key={d.label} style={styles.legendRow}>
            <View style={[styles.swatch, { backgroundColor: d.color }]} />
            <AppText variant="body" style={styles.legendLabel}>
              {d.label}
            </AppText>
            <AppText variant="bodyBold">
              {Math.round((d.value / total) * 100)}% · {formatCurrency(d.value)}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  legend: { width: '100%', marginTop: spacing.lg },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs + 2 },
  swatch: { width: 14, height: 14, borderRadius: 4, marginRight: spacing.sm },
  legendLabel: { flex: 1 },
});
