#!/usr/bin/env python3
"""
Scenario Probability and Expected Value Calculator

This module calculates probability-weighted expected values for investment scenarios:
- Weighted expected value across multiple scenarios
- Upside/downside ratio analysis
- Risk-reward assessment

Author: Equity Analyst Skill
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import math


@dataclass
class Scenario:
    """Definition of a single investment scenario."""
    name: str
    price_target: float
    probability: float  # As decimal (0.25 = 25%)
    rationale: Optional[str] = None


@dataclass
class ScenarioAnalysisOutput:
    """Output from scenario probability analysis."""
    expected_value: float
    expected_return: float
    upside_potential: float
    downside_risk: float
    risk_reward_ratio: float
    probability_weighted_upside: float
    probability_weighted_downside: float
    scenario_details: List[Dict]


def validate_scenarios(scenarios: List[Scenario]) -> Tuple[bool, str]:
    """
    Validate that scenario probabilities sum to approximately 1.0.

    Args:
        scenarios: List of Scenario objects

    Returns:
        Tuple of (is_valid, error_message)
    """
    total_prob = sum(s.probability for s in scenarios)

    if not (0.99 <= total_prob <= 1.01):
        return False, f"Probabilities sum to {total_prob:.2%}, should sum to 100%"

    for s in scenarios:
        if s.probability < 0 or s.probability > 1:
            return False, f"Scenario '{s.name}' has invalid probability: {s.probability}"
        if s.price_target < 0:
            return False, f"Scenario '{s.name}' has negative price target: {s.price_target}"

    return True, ""


def calculate_expected_value(
    scenarios: List[Scenario],
    current_price: float
) -> ScenarioAnalysisOutput:
    """
    Calculate probability-weighted expected value and risk metrics.

    Args:
        scenarios: List of Scenario objects with price targets and probabilities
        current_price: Current stock price

    Returns:
        ScenarioAnalysisOutput with complete analysis

    Raises:
        ValueError: If scenario probabilities don't sum to 1.0
    """
    # Validate inputs
    is_valid, error = validate_scenarios(scenarios)
    if not is_valid:
        raise ValueError(error)

    # Calculate expected value
    expected_value = sum(s.price_target * s.probability for s in scenarios)
    expected_return = (expected_value / current_price - 1) if current_price > 0 else 0

    # Calculate upside/downside metrics
    upside_scenarios = [s for s in scenarios if s.price_target > current_price]
    downside_scenarios = [s for s in scenarios if s.price_target <= current_price]

    # Maximum upside and downside
    if upside_scenarios:
        max_upside = max(s.price_target for s in upside_scenarios)
        upside_potential = (max_upside / current_price - 1) if current_price > 0 else 0
    else:
        upside_potential = 0

    if downside_scenarios:
        max_downside = min(s.price_target for s in downside_scenarios)
        downside_risk = (1 - max_downside / current_price) if current_price > 0 else 0
    else:
        downside_risk = 0

    # Probability-weighted upside and downside
    prob_weighted_upside = sum(
        (s.price_target / current_price - 1) * s.probability
        for s in upside_scenarios
    ) if current_price > 0 else 0

    prob_weighted_downside = sum(
        (1 - s.price_target / current_price) * s.probability
        for s in downside_scenarios
    ) if current_price > 0 else 0

    # Risk-reward ratio
    if prob_weighted_downside > 0:
        risk_reward_ratio = prob_weighted_upside / prob_weighted_downside
    else:
        risk_reward_ratio = float('inf') if prob_weighted_upside > 0 else 0

    # Build scenario details
    scenario_details = []
    for s in scenarios:
        return_pct = (s.price_target / current_price - 1) * 100 if current_price > 0 else 0
        contribution = (s.price_target * s.probability)

        scenario_details.append({
            'name': s.name,
            'price_target': s.price_target,
            'probability': s.probability,
            'return_pct': return_pct,
            'ev_contribution': contribution,
            'rationale': s.rationale
        })

    # Sort by price target (highest first)
    scenario_details.sort(key=lambda x: x['price_target'], reverse=True)

    return ScenarioAnalysisOutput(
        expected_value=expected_value,
        expected_return=expected_return,
        upside_potential=upside_potential,
        downside_risk=downside_risk,
        risk_reward_ratio=risk_reward_ratio,
        probability_weighted_upside=prob_weighted_upside,
        probability_weighted_downside=prob_weighted_downside,
        scenario_details=scenario_details
    )


def run_scenario_analysis(
    scenarios: List[Scenario],
    current_price: float
) -> ScenarioAnalysisOutput:
    """
    Run complete scenario probability analysis.

    Args:
        scenarios: List of Scenario objects
        current_price: Current stock price

    Returns:
        ScenarioAnalysisOutput with full analysis
    """
    return calculate_expected_value(scenarios, current_price)


def format_scenario_report(
    output: ScenarioAnalysisOutput,
    current_price: float,
    ticker: str = "STOCK"
) -> str:
    """
    Format scenario analysis as a readable report.

    Args:
        output: ScenarioAnalysisOutput from analysis
        current_price: Current stock price
        ticker: Stock ticker symbol

    Returns:
        Formatted string report
    """
    lines = []
    lines.append("=" * 70)
    lines.append(f"SCENARIO PROBABILITY ANALYSIS: {ticker}")
    lines.append("=" * 70)

    lines.append(f"\nCurrent Price: ${current_price:.2f}")

    # Scenario table
    lines.append("\n1. SCENARIO BREAKDOWN")
    lines.append("-" * 70)
    lines.append(f"{'Scenario':<20} {'Target':>10} {'Prob':>10} {'Return':>12} {'EV Contrib':>12}")
    lines.append("-" * 70)

    for sd in output.scenario_details:
        lines.append(
            f"{sd['name']:<20} "
            f"${sd['price_target']:>8.2f} "
            f"{sd['probability']:>9.1%} "
            f"{sd['return_pct']:>+11.1f}% "
            f"${sd['ev_contribution']:>10.2f}"
        )

    lines.append("-" * 70)
    lines.append(f"{'EXPECTED VALUE':<20} ${output.expected_value:>8.2f}")

    # Risk metrics
    lines.append("\n2. RISK-REWARD ANALYSIS")
    lines.append("-" * 50)
    lines.append(f"Expected Value: ${output.expected_value:.2f}")
    lines.append(f"Expected Return: {output.expected_return:+.1%}")
    lines.append(f"\nMaximum Upside: {output.upside_potential:+.1%}")
    lines.append(f"Maximum Downside: {output.downside_risk:.1%}")
    lines.append(f"\nProbability-Weighted Upside: {output.probability_weighted_upside:+.1%}")
    lines.append(f"Probability-Weighted Downside: {output.probability_weighted_downside:.1%}")
    lines.append(f"\nRisk-Reward Ratio: {output.risk_reward_ratio:.2f}x")

    # Interpretation
    lines.append("\n3. INTERPRETATION")
    lines.append("-" * 50)

    if output.expected_return > 0.15:
        lines.append("Strong positive expected-value scenario set: expected return exceeds 15%")
    elif output.expected_return > 0.05:
        lines.append("Moderate positive expected-value scenario set: expected return between 5-15%")
    elif output.expected_return > 0:
        lines.append("Marginal positive expected-value scenario set: expected return below 5%")
    else:
        lines.append("Negative expected-value scenario set: document the assumptions and downside drivers")

    if output.risk_reward_ratio > 2:
        lines.append("Favorable Risk-Reward: Upside significantly outweighs downside")
    elif output.risk_reward_ratio > 1:
        lines.append("Balanced Risk-Reward: Upside modestly exceeds downside")
    else:
        lines.append("Unfavorable Risk-Reward: Downside exceeds upside")

    lines.append("\n" + "=" * 70)
    return "\n".join(lines)


def create_scenario_matrix(
    base_scenarios: List[Scenario],
    probability_adjustments: Dict[str, List[float]],
    current_price: float
) -> List[Dict]:
    """
    Create a matrix showing expected values under different probability assumptions.

    Args:
        base_scenarios: Base scenario definitions
        probability_adjustments: Dict mapping scenario names to list of alternative probabilities
        current_price: Current stock price

    Returns:
        List of dictionaries with different probability combinations and their EVs
    """
    results = []

    # Get base case
    base_output = calculate_expected_value(base_scenarios, current_price)
    results.append({
        'case': 'Base',
        'probabilities': {s.name: s.probability for s in base_scenarios},
        'expected_value': base_output.expected_value,
        'expected_return': base_output.expected_return
    })

    # Test different probability combinations
    for scenario_name, alt_probs in probability_adjustments.items():
        for alt_prob in alt_probs:
            # Find the scenario to adjust
            adjusted_scenarios = []
            prob_delta = 0

            for s in base_scenarios:
                if s.name == scenario_name:
                    prob_delta = alt_prob - s.probability
                    adjusted_scenarios.append(Scenario(
                        name=s.name,
                        price_target=s.price_target,
                        probability=alt_prob,
                        rationale=s.rationale
                    ))
                else:
                    adjusted_scenarios.append(s)

            # Redistribute probability delta to other scenarios proportionally
            other_total = sum(s.probability for s in adjusted_scenarios if s.name != scenario_name)
            if other_total > 0 and prob_delta != 0:
                final_scenarios = []
                for s in adjusted_scenarios:
                    if s.name != scenario_name:
                        adjustment = -(prob_delta * s.probability / other_total)
                        new_prob = max(0, min(1, s.probability + adjustment))
                        final_scenarios.append(Scenario(
                            name=s.name,
                            price_target=s.price_target,
                            probability=new_prob,
                            rationale=s.rationale
                        ))
                    else:
                        final_scenarios.append(s)

                # Normalize to sum to 1
                total = sum(s.probability for s in final_scenarios)
                normalized = [
                    Scenario(
                        name=s.name,
                        price_target=s.price_target,
                        probability=s.probability / total,
                        rationale=s.rationale
                    ) for s in final_scenarios
                ]

                try:
                    output = calculate_expected_value(normalized, current_price)
                    results.append({
                        'case': f'{scenario_name} = {alt_prob:.0%}',
                        'probabilities': {s.name: s.probability for s in normalized},
                        'expected_value': output.expected_value,
                        'expected_return': output.expected_return
                    })
                except ValueError:
                    pass  # Skip invalid combinations

    return results


if __name__ == "__main__":
    # Example: Analyze investment scenarios for a tech stock
    print("=" * 70)
    print("SCENARIO PROBABILITY ANALYSIS - EXAMPLE")
    print("=" * 70)

    current_price = 100.00

    # Define investment scenarios
    scenarios = [
        Scenario(
            name="Bull Case",
            price_target=150.00,
            probability=0.25,
            rationale="Market expansion succeeds, margins improve, multiple expansion"
        ),
        Scenario(
            name="Base Case",
            price_target=120.00,
            probability=0.50,
            rationale="Steady execution, moderate growth, stable multiples"
        ),
        Scenario(
            name="Bear Case",
            price_target=70.00,
            probability=0.25,
            rationale="Competition intensifies, margin compression, multiple contraction"
        )
    ]

    # Run analysis
    print("\n1. STANDARD ANALYSIS")
    print("-" * 40)
    result = run_scenario_analysis(
        scenarios=scenarios,
        current_price=current_price
    )

    print(format_scenario_report(result, current_price, "TECH"))

    # Show scenario matrix
    print("\n" + "=" * 70)
    print("2. PROBABILITY SENSITIVITY")
    print("-" * 40)

    adjustments = {
        'Bull Case': [0.15, 0.35],
        'Bear Case': [0.15, 0.35]
    }

    matrix = create_scenario_matrix(scenarios, adjustments, current_price)

    print(f"\n{'Case':<25} {'Expected Value':>15} {'Expected Return':>15}")
    print("-" * 55)
    for row in matrix:
        print(f"{row['case']:<25} ${row['expected_value']:>13.2f} {row['expected_return']:>14.1%}")

    # More complex example with 5 scenarios
    print("\n" + "=" * 70)
    print("3. FIVE-SCENARIO ANALYSIS")
    print("-" * 40)

    detailed_scenarios = [
        Scenario("Exceptional", 180.00, 0.10, "Everything goes right"),
        Scenario("Bull", 140.00, 0.20, "Strong execution"),
        Scenario("Base", 110.00, 0.40, "In-line performance"),
        Scenario("Bear", 80.00, 0.20, "Underperformance"),
        Scenario("Disaster", 50.00, 0.10, "Major setback")
    ]

    detailed_result = run_scenario_analysis(
        scenarios=detailed_scenarios,
        current_price=current_price
    )

    print(format_scenario_report(detailed_result, current_price, "TECH"))

    # Raw output
    print("\n" + "=" * 70)
    print("4. RAW OUTPUT")
    print("-" * 40)
    print(f"Expected Value: ${detailed_result.expected_value:.2f}")
    print(f"Risk-Reward Ratio: {detailed_result.risk_reward_ratio:.2f}x")
