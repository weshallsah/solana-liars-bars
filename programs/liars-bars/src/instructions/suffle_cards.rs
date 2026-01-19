use anchor_lang::prelude::*;
use inco_lightning::{
    cpi::{as_euint128, e_rand, Operation},
    IncoLightning,
};

use crate::{
    constant::INCO_LIGHTNING_ID,
    events::SuffleCardsForPlayer,
    state::{Card, LiarsTable, Player},
};

#[derive(Accounts)]
#[instruction(table_id:u64)]
pub struct SuffleCards<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"table", table_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub table: Account<'info, LiarsTable>,

    #[account(
       mut,
        seeds = [b"player", table_id.to_le_bytes().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub players: Account<'info, Player>,

    pub system_program: Program<'info, System>,

    #[account(address = INCO_LIGHTNING_ID)]
    pub inco_lightning_program: Program<'info, IncoLightning>,
}

pub fn handler(ctx: Context<SuffleCards>, table_id: u64) -> Result<()> {
    let player = &mut ctx.accounts.players;
    let table = &mut ctx.accounts.table;
    let inco = ctx.accounts.inco_lightning_program.to_account_info();
    let operation = Operation {
        signer: ctx.accounts.signer.to_account_info(),
    };

    let mut idx = 0;
    for i in 0..table.players.len() {
        if table.players[i] == ctx.accounts.signer.key() {
            idx = i;
            break;
        }
    }

    let cpi_ctx = CpiContext::new(inco.clone(), operation.clone());
    let mut random_number: u128 = e_rand(cpi_ctx, 0)?.0;

    let mut available: Vec<(u128, u128)> = Vec::with_capacity(52);
    for shape in 0u128..4 {
        for value in 0u128..13 {
            if !table.deck[shape as usize][value as usize] {
                available.push((shape, value));
            }
        }
    }

    for _ in 0..5 {
        if available.is_empty() {
            break;
        }

        let idx = (random_number % available.len() as u128) as usize;
        random_number = random_number.checked_div(52).unwrap();

        let (shape, value) = available.swap_remove(idx);
        let cpi_shape = CpiContext::new(inco.clone(), operation.clone());
        let cpi_value = CpiContext::new(inco.clone(), operation.clone());

        player.cards.push(Card {
            shape: as_euint128(cpi_shape, shape)?,
            value: as_euint128(cpi_value, value)?,
        });
        table.deck[shape as usize][value as usize] = true;
    }

    emit!(SuffleCardsForPlayer {
        table_id,
        player: ctx.accounts.signer.key(),
        next: table.players[((idx + 1) % table.players.len()) as usize]
    });

    Ok(())
}
