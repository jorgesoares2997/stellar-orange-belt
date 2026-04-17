#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol,
};

#[contracttype]
#[derive(Clone)]
pub enum StorageKey {
    Initialized,
    Owner,
    Goal,
    Total,
    Donors,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    InvalidAmount = 3,
    Overflow = 4,
}

#[contract]
pub struct MicroCrowdfunding;

#[contractimpl]
impl MicroCrowdfunding {
    pub fn initialize(env: Env, owner: Address, goal: i128) -> Result<(), ContractError> {
        if env.storage().instance().has(&StorageKey::Initialized) {
            return Err(ContractError::AlreadyInitialized);
        }

        if goal <= 0 {
            return Err(ContractError::InvalidAmount);
        }

        owner.require_auth();

        env.storage().instance().set(&StorageKey::Owner, &owner);
        env.storage().instance().set(&StorageKey::Goal, &goal);
        env.storage().instance().set(&StorageKey::Total, &0i128);
        env.storage()
            .instance()
            .set(&StorageKey::Donors, &Map::<Address, i128>::new(&env));
        env.storage().instance().set(&StorageKey::Initialized, &true);

        Ok(())
    }

    pub fn donate(env: Env, donor: Address, amount: i128) -> Result<i128, ContractError> {
        Self::assert_initialized(&env)?;

        if amount <= 0 {
            return Err(ContractError::InvalidAmount);
        }

        donor.require_auth();

        let mut donors = env
            .storage()
            .instance()
            .get::<_, Map<Address, i128>>(&StorageKey::Donors)
            .unwrap_or_else(|| Map::new(&env));

        let total = env
            .storage()
            .instance()
            .get::<_, i128>(&StorageKey::Total)
            .unwrap_or(0);
        let donor_total = donors.get(donor.clone()).unwrap_or(0);

        let new_total = total
            .checked_add(amount)
            .ok_or(ContractError::Overflow)?;
        let new_donor_total = donor_total
            .checked_add(amount)
            .ok_or(ContractError::Overflow)?;

        donors.set(donor.clone(), new_donor_total);

        env.storage().instance().set(&StorageKey::Donors, &donors);
        env.storage().instance().set(&StorageKey::Total, &new_total);

        let donate_event: Symbol = symbol_short!("donate");
        env.events()
            .publish((donate_event, donor), (amount, new_total));

        Ok(new_total)
    }

    pub fn total_raised(env: Env) -> Result<i128, ContractError> {
        Self::assert_initialized(&env)?;
        Ok(env
            .storage()
            .instance()
            .get::<_, i128>(&StorageKey::Total)
            .unwrap_or(0))
    }

    pub fn campaign_goal(env: Env) -> Result<i128, ContractError> {
        Self::assert_initialized(&env)?;
        Ok(env.storage().instance().get(&StorageKey::Goal).unwrap_or(0))
    }

    pub fn donor_total(env: Env, donor: Address) -> Result<i128, ContractError> {
        Self::assert_initialized(&env)?;

        let donors = env
            .storage()
            .instance()
            .get::<_, Map<Address, i128>>(&StorageKey::Donors)
            .unwrap_or_else(|| Map::new(&env));

        Ok(donors.get(donor).unwrap_or(0))
    }

    fn assert_initialized(env: &Env) -> Result<(), ContractError> {
        if !env.storage().instance().has(&StorageKey::Initialized) {
            return Err(ContractError::NotInitialized);
        }
        Ok(())
    }
}

#[cfg(test)]
mod test;
