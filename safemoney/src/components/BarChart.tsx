import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '../theme';

export interface Bar {
  label: string;
  value: number;
}

interface Props {
  data: Bar[];
  width: number;
  height?: number;
}

export function BarChart({ data, width, height = 200 }: Props) {
  const padTop = 22;
  const padBottom = 24;
  const chartH = height - padTop - padBottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = width / data.length;
  const barW = Math.min(36, slot * 0.6);

  return (
    <View
      accessible
      accessibilityLabel={`Monthly spending. ${data.map((d) => `${d.label} $${Math.round(d.value)}`).join(', ')}`}
    >
      <Svg width={width} height={height}>
        <Line x1={0} x2={width} y1={padTop + chartH} y2={padTop + chartH} stroke={colors.border} strokeWidth={1} />
        {data.map((d, i) => {
          const h = (d.value / max) * chartH;
          const x = i * slot + (slot - barW) / 2;
          const y = padTop + chartH - h;
          const current = i === data.length - 1;
          return (
            <React.Fragment key={d.label}>
              <Rect x={x} y={y} width={barW} height={Math.max(h, 2)} rx={6} fill={current ? colors.primary : colors.slate} />
              <SvgText x={x + barW / 2} y={y - 6} fontSize={11} textAnchor="middle" fill={colors.text} fontFamily={fonts.semibold}>
                {`$${Math.round(d.value).toLocaleString('en-US')}`}
              </SvgText>
              <SvgText x={x + barW / 2} y={height - 6} fontSize={12} textAnchor="middle" fill={colors.textMuted} fontFamily={fonts.regular}>
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
