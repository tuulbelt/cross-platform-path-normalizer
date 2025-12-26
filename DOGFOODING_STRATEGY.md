# Dogfooding Strategy: Cross-Platform Path Normalizer

## High-Value Compositions

### 1. Test Flakiness Detector - Validate 145 tests

**Why:** Path normalization must be 100% deterministic (used by other tools)

**Script:** `scripts/dogfood-flaky.sh`

```bash
./scripts/dogfood-flaky.sh 10
# ✅ 145 tests × 10 runs = 1,450 executions
```

### 2. Output Diffing Utility - Ensure identical outputs

**Why:** Path outputs must be consistent across runs (no random data)

**Script:** `scripts/dogfood-diff.sh`

```bash
./scripts/dogfood-diff.sh
# Compares path normalization outputs between runs
```

## Expected Outcomes

- **Proves Determinism**: 145 tests pass consistently
- **Validates Reliability**: Safe for other tools to depend on
- **Used By**: Output Diffing, Semaphore, Test Flakiness Detector

## Implementation Checklist

- [ ] `scripts/dogfood-flaky.sh` - Test Flakiness Detector validation
- [ ] `scripts/dogfood-diff.sh` - Output Diffing validation
- [ ] Update README with composition examples
- [ ] Update GH Pages docs

---

**Status:** Ready for implementation
