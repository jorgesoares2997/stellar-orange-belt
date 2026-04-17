#![cfg(test)]

extern crate std;

use crate::{ContractError, MicroCrowdfunding, MicroCrowdfundingClient};
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn donate_success_updates_total() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(MicroCrowdfunding, ());
    let client = MicroCrowdfundingClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let donor = Address::generate(&env);

    client.initialize(&owner, &1_000);

    let new_total = client.donate(&donor, &250);
    assert_eq!(new_total, 250);

    let total = client.total_raised();
    assert_eq!(total, 250);
    assert_eq!(client.donor_total(&donor), 250);
}

#[test]
fn reject_invalid_donation_amount() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(MicroCrowdfunding, ());
    let client = MicroCrowdfundingClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let donor = Address::generate(&env);

    client.initialize(&owner, &1_000);

    let err = client.try_donate(&donor, &0);
    assert_eq!(err, Err(Ok(ContractError::InvalidAmount)));
}

#[test]
fn multiple_donors_accumulate_state() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(MicroCrowdfunding, ());
    let client = MicroCrowdfundingClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let donor_a = Address::generate(&env);
    let donor_b = Address::generate(&env);

    client.initialize(&owner, &5_000);

    client.donate(&donor_a, &700);
    client.donate(&donor_b, &300);

    assert_eq!(client.total_raised(), 1_000);
    assert_eq!(client.donor_total(&donor_a), 700);
    assert_eq!(client.donor_total(&donor_b), 300);
}
