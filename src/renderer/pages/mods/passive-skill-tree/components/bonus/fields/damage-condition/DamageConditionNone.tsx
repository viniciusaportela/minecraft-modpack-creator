export default function DamageConditionNone() {
  return null;
}

DamageConditionNone.getDefaultConfig = () => {
  return {
    type: 'skilltree:none',
  };
};
