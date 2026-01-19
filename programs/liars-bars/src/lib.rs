#![allow(unexpected_cfgs)]
#![allow(unused)]
#![allow(deprecated)]
use anchor_lang::prelude::*;
pub mod constant;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;
use instructions::*;

declare_id!("6wYATvBh3f8gPZGTTeRJ8Qs38S1XcjJCybHyfBCDRFhg");

#[program]
pub mod liars_bar_dapp {
    use super::*;

    pub fn create_table(ctx: Context<InitializeTable>, table_id: u64) -> Result<()> {
        instructions::create_table::handler(ctx, table_id)
    }

    pub fn join_table(ctx: Context<JoinTable>, table_id: u64) -> Result<()> {
        instructions::join_table::handler(ctx, table_id)
    }

    pub fn start_round(ctx:Context<StartRound>,table_id: u64)-> Result<()>{
        instructions::start_rounds::handler(ctx, table_id)
    }

    pub fn suffle_cards(ctx: Context<SuffleCards>, table_id: u64) -> Result<()> {
        instructions::suffle_cards::handler(ctx, table_id)
    }

    pub fn place_cards(
        ctx: Context<PlaceCards>,
        table_id: u64,
        picked_indexs: Vec<u8>,
    ) -> Result<()> {
        instructions::place_cards::handler(ctx, table_id, picked_indexs)
    }
}
