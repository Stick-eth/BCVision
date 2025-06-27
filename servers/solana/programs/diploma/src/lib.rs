use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkgz5k4Gh2ySZ");

#[program]
pub mod diploma {
    use super::*;
    pub fn store_hash(ctx: Context<StoreHash>, hash: String) -> Result<()> {
        let diploma = &mut ctx.accounts.diploma;
        diploma.owner = *ctx.accounts.authority.key;
        diploma.hash = hash;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct StoreHash<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 64)]
    pub diploma: Account<'info, Diploma>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Diploma {
    pub owner: Pubkey,
    pub hash: String,
}
